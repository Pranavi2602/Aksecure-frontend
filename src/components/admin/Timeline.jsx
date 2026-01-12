import { Clock, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Timeline = ({ timeline, currentUserName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedImageList, setSelectedImageList] = useState([]);

  if (!timeline || timeline.length === 0) return null;

  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const openImageGallery = (images, startIndex = 0) => {
    setSelectedImageList(images);
    setSelectedImageIndex(startIndex);
  };

  const closeImageGallery = () => {
    setSelectedImageIndex(null);
    setSelectedImageList([]);
  };

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && selectedImageIndex > 0) {
        setSelectedImageIndex(selectedImageIndex - 1);
      } else if (e.key === 'ArrowRight' && selectedImageIndex < selectedImageList.length - 1) {
        setSelectedImageIndex(selectedImageIndex + 1);
      } else if (e.key === 'Escape') {
        closeImageGallery();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, selectedImageList.length]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 ring-1 ring-slate-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center ring-2 ring-amber-100">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Timeline ({timeline.length})</h3>
        </div>
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const isAdmin = currentUserName === item.addedBy || item.addedBy === 'Admin';
            const images = item.images || [];
            return (
              <div
                key={index}
                className={`relative pl-6 pb-4 border-l-2 ${
                  isAdmin
                    ? 'border-slate-500'
                    : 'border-slate-300'
                }`}
              >
                <div className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 ${
                  isAdmin
                    ? 'bg-slate-600 border-slate-700'
                    : 'bg-slate-400 border-slate-500'
                }`}></div>
                <div className={`p-4 rounded-xl border-2 ${
                  isAdmin
                    ? 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-300 shadow-sm'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-sm ${
                          isAdmin ? 'text-slate-900' : 'text-slate-900'
                        }`}
                      >
                        {item.addedBy}
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full text-xs font-semibold shadow-sm">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Clock className={`w-3.5 h-3.5 ${
                        isAdmin ? 'text-slate-600' : 'text-slate-500'
                      }`} />
                      <span
                        className={
                          isAdmin ? 'text-slate-600' : 'text-slate-500'
                        }
                      >
                        {new Date(item.addedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-relaxed mb-3 ${
                      isAdmin ? 'text-slate-800' : 'text-slate-700'
                    }`}
                  >
                    {item.note}
                  </p>

                  {/* Images */}
                  {images.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">Attached Images ({images.length})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image, imgIndex) => {
                          const imageUrl = image.startsWith('http') 
                            ? image 
                            : `${baseUrl}${image}`;
                          return (
                            <div
                              key={imgIndex}
                              className="relative group cursor-pointer"
                              onClick={() => openImageGallery(images, imgIndex)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Attachment ${imgIndex + 1}`}
                                className="w-full h-20 object-cover rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen image gallery modal */}
      {selectedImageIndex !== null && selectedImageList.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeImageGallery}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageGallery}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Previous Image Button */}
            {selectedImageList.length > 1 && selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex - 1);
                }}
                className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {/* Next Image Button */}
            {selectedImageList.length > 1 && selectedImageIndex < selectedImageList.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex + 1);
                }}
                className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            
            {/* Image Counter */}
            {selectedImageList.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                {selectedImageIndex + 1} / {selectedImageList.length}
              </div>
            )}
            
            <img
              src={selectedImageList[selectedImageIndex].startsWith('http') 
                ? selectedImageList[selectedImageIndex] 
                : `${baseUrl}${selectedImageList[selectedImageIndex]}`}
              alt={`Full size ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Timeline;

