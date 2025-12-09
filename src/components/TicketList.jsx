import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Eye } from 'lucide-react';

const TicketList = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No tickets found. Create your first ticket above!
      </div>
    );
  }

  const getStatusColor = (status) => {
    const normalizedStatus = status === 'Open' ? 'New' : status;
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[normalizedStatus] || 'bg-gray-100 text-gray-800';
  };

  const isAdminReply = (timelineItem) => {
    if (!user || !timelineItem) return false;
    return timelineItem.addedBy !== user.name;
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

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const adminRepliesInfo = getAdminRepliesInfo(ticket);
        return (
        <div key={ticket._id} className={`bg-white rounded-lg shadow-md p-6 ${adminRepliesInfo.hasReplies ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-gray-800">{ticket.title}</h3>
                {adminRepliesInfo.hasReplies && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status === 'Open' ? 'New' : ticket.status}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{ticket.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium">Category:</span> {ticket.category}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
            {ticket.preferredVisitAt && (
              <div>
                <span className="font-medium">Preferred Visit:</span> {new Date(ticket.preferredVisitAt).toLocaleDateString()}
              </div>
            )}
            {ticket.assignedVisitAt && (
              <div>
                <span className="font-medium">Scheduled Visit:</span> {new Date(ticket.assignedVisitAt).toLocaleString()}
              </div>
            )}
          </div>

          {ticket.images && ticket.images.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
              <div className="flex gap-2 flex-wrap">
                {ticket.images.map((image, index) => {
                  const imageUrl = image.startsWith('http') 
                    ? image 
                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${image}`;
                  return (
                    <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedImage(imageUrl)}>
                      <img
                        src={imageUrl}
                        alt={`Ticket image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300 hover:border-blue-400 transition-all"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {ticket.timeline && ticket.timeline.length > 0 && (() => {
            const adminReplies = ticket.timeline.filter(item => isAdminReply(item));
            if (adminReplies.length === 0) return null;
            
            return (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Admin Replies:</p>
                <div className="space-y-2">
                  {adminReplies.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm p-3 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <div className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-blue-900">
                              {item.addedBy}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full font-medium">
                              Admin
                            </span>
                          </div>
                          <p className="text-blue-800">
                            {item.note}
                          </p>
                          <span className="text-xs mt-1 block text-blue-600">
                            {new Date(item.addedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      );
      })}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;

