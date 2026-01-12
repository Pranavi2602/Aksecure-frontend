import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, Loader2, RefreshCw, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';

const TicketList = ({ onRefresh }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const observer = useRef();
  const lastTicketRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch tickets with pagination and server-side filtering
  const fetchTickets = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setTickets([]);
        setError('');
      } else {
        setIsRefreshing(true);
      }

      const currentPage = isLoadMore ? page + 1 : 1;

      // First, try to get tickets from the /tickets endpoint
      let response;
      try {
        response = await api.get('/tickets');

        // If we get an array, use it directly
        if (Array.isArray(response.data)) {
          const newTickets = response.data;
          setTickets(prevTickets => isLoadMore ? [...prevTickets, ...newTickets] : newTickets);
          setHasMore(newTickets.length === 10);
        }
        // If we get an object with a tickets array
        else if (response.data && Array.isArray(response.data.tickets)) {
          const newTickets = response.data.tickets;
          setTickets(prevTickets => isLoadMore ? [...prevTickets, ...newTickets] : newTickets);
          setHasMore(response.data.hasMore || false);
        }
        // If the response is in an unexpected format
        else {
          console.warn('Unexpected response format:', response.data);
          setTickets([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        throw err;
      }

      if (isLoadMore) {
        setPage(currentPage);
      }
    } catch (err) {
      console.error('Error in fetchTickets:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load tickets. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page]);

  // Initial load
  useEffect(() => {
    fetchTickets(false);
  }, [fetchTickets]);

  if (loading && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <span className="text-gray-600">Loading tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={() => fetchTickets(false)}
          className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tickets.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          {error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : (
            <div>No tickets found</div>
          )}
        </div>
        <button
          onClick={() => fetchTickets(false)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusMap = {
      'New': 'bg-emerald-100 text-emerald-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-slate-100 text-slate-800',
      'Open': 'bg-emerald-100 text-emerald-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const isAdminReply = (timelineItem) => {
    if (!user || !timelineItem) return false;
    return timelineItem.addedBy !== user.name;
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tickets/${ticketToDelete._id}`);
      // Remove the deleted ticket from the list
      setTickets(prevTickets =>
        prevTickets.filter(ticket => ticket._id !== ticketToDelete._id)
      );
      toast.success('Ticket deleted successfully');
      setShowDeleteModal(false);
      setTicketToDelete(null);
    } catch (err) {
      console.error('Error deleting ticket:', err);
      toast.error(err.response?.data?.message || 'Failed to delete ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  const getAdminRepliesInfo = (ticket) => {
    if (!ticket.timeline || ticket.timeline.length === 0) {
      return { count: 0, hasReplies: false };
    }
    const adminReplies = ticket.timeline.filter(item => isAdminReply(item));
    return {
      count: adminReplies.length,
      hasReplies: adminReplies.length > 0,
      lastReply: adminReplies.length > 0 ? adminReplies[adminReplies.length - 1] : null
    };
  };

  // Render the list of tickets
  const renderTicketList = () => {
    if (tickets.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No tickets found</div>
          <button
            onClick={() => fetchTickets(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tickets.map((ticket, index) => {
          const adminRepliesInfo = getAdminRepliesInfo(ticket);
          const isLastTicket = index === tickets.length - 1;
          const adminReplies = ticket.timeline ? ticket.timeline.filter(item => isAdminReply(item)) : [];

          return (
            <div
              key={ticket._id}
              ref={isLastTicket && hasMore ? lastTicketRef : null}
              className="bg-white rounded-xl shadow-sm p-6 ring-2 ring-purple-400 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-gray-800">{ticket.title}</h3>
                    {adminRepliesInfo.hasReplies && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                        Admin Replied
                        {adminRepliesInfo.count > 1 && ` (${adminRepliesInfo.count})`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Ticket ID: {ticket.ticketId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'Open' ? 'New' : ticket.status}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete button clicked for ticket:', ticket._id);
                      setTicketToDelete(ticket);
                      setShowDeleteModal(true);
                    }}
                    className="relative z-10 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{ticket.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Category:</span> {ticket.category || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> {ticket.priority || 'Normal'}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(ticket.updatedAt).toLocaleString()}
                </div>
              </div>

              {ticket.images && ticket.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}${image}`}
                        alt={`Attachment ${imgIndex + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
                        onClick={() => {
                          const allImageUrls = ticket.images.map(img =>
                            img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`
                          );
                          setSelectedImage({
                            url: image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}${image}`,
                            index: imgIndex,
                            allImages: allImageUrls
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {adminReplies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Admin Replies:</p>
                  <div className="space-y-3">
                    {adminReplies.map((item, index) => {
                      const images = item.images || [];
                      const baseUrl = import.meta.env.VITE_API_URL || '';

                      return (
                        <div key={index} className="bg-purple-50 p-3 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-purple-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-purple-800">
                                  {item.addedBy || 'Admin'}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(item.addedAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{item.note}</p>

                              {images.length > 0 && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                  {images.map((imageUrl, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`}
                                      alt={`Admin attachment ${imgIndex + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border-2 border-purple-200 cursor-pointer hover:border-purple-400 transition-all"
                                      onClick={() => {
                                        const allImageUrls = images.map(img =>
                                          img.startsWith('http') ? img : `${baseUrl}${img}`
                                        );
                                        setSelectedImage({
                                          url: imageUrl,
                                          index: imgIndex,
                                          allImages: allImageUrls
                                        });
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const renderImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Image Button */}
          {selectedImage.allImages && selectedImage.allImages.length > 1 && selectedImage.index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({
                  ...selectedImage,
                  index: selectedImage.index - 1,
                  url: selectedImage.allImages[selectedImage.index - 1]
                });
              }}
              className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Image */}
          <img
            src={typeof selectedImage === 'string' ? selectedImage : selectedImage.url}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Image Button */}
          {selectedImage.allImages && selectedImage.allImages.length > 1 && selectedImage.index < selectedImage.allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({
                  ...selectedImage,
                  index: selectedImage.index + 1,
                  url: selectedImage.allImages[selectedImage.index + 1]
                });
              }}
              className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image Counter */}
          {selectedImage.allImages && selectedImage.allImages.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {selectedImage.index + 1} / {selectedImage.allImages.length}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render
  if (loading && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <span className="text-gray-600">Loading tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={() => fetchTickets(false)}
          className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tickets.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">No tickets found</div>
        <button
          onClick={() => fetchTickets(false)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
        {/* Refresh button removed */}
      </div>

      {renderTicketList()}
      {renderImageModal()}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Ticket</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Are you sure you want to delete ticket <span className="font-semibold">{ticketToDelete.ticketId}</span>?
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTicketToDelete(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              This action cannot be undone. All ticket data, images, and timeline will be permanently removed.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTicketToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default TicketList;
