import { Shield, MessageSquare, Save, Loader2, Calendar, Clock } from 'lucide-react';
import UserInfo from './UserInfo';
import ImageGallery from './ImageGallery';
import Timeline from './Timeline';
import ReplyModal from './ReplyModal';
import { getCategoryColor } from './utils.jsx';

const serviceRequestStatusOptions = ['New', 'In Progress', 'Completed'];

const ServiceRequestDetailsPanel = ({
  serviceRequest,
  user,
  updateStatus,
  setUpdateStatus,
  visitDateTime,
  setVisitDateTime,
  newComment,
  setNewComment,
  errors,
  setErrors,
  updating,
  onUpdateServiceRequest,
  onAddComment,
  showReplyModal,
  setShowReplyModal,
  onReply
}) => {
  if (!serviceRequest) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ring-4 ring-slate-50">
              <Shield className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">Select a service request to view details</p>
            <p className="text-sm text-slate-500">Click on any service request from the left panel to see full information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <div className="p-6 space-y-6">
          {/* Reply Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowReplyModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Reply to User
            </button>
          </div>

          {/* Service Request Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 ring-1 ring-slate-100">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {serviceRequest.title}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ring-2 ${
                      serviceRequest.status === 'New' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100' :
                      serviceRequest.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100' :
                      serviceRequest.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200 ring-green-100' :
                      'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100'
                    }`}
                  >
                    {serviceRequest.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Request ID: <span className="font-mono font-bold text-slate-700">{serviceRequest.requestId}</span>
                </p>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(serviceRequest.category)}`}>
                  {serviceRequest.category}
                </span>
              </div>
              {/* Update Service Request Form - Top Right */}
              <div className="ml-4 w-80 flex-shrink-0">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Update Request
                  </h3>
                  <div className="space-y-3">
                    {errors.update && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        {errors.update}
                      </div>
                    )}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Status
                        </label>
                        <select
                          value={updateStatus}
                          onChange={(e) => {
                            setUpdateStatus(e.target.value);
                            setErrors(prev => ({ ...prev, status: '', update: '' }));
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm ${
                            errors.status || errors.update
                              ? 'border-red-300 focus:ring-red-500 bg-red-50'
                              : 'border-slate-300 focus:ring-slate-500 bg-white'
                          }`}
                        >
                          {serviceRequestStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={onUpdateServiceRequest}
                        disabled={updating}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        {updating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 mb-5 border border-slate-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{serviceRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Created</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date(serviceRequest.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(serviceRequest.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {serviceRequest.preferredVisitAt && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">Preferred</span>
                  </div>
                  <p className="font-semibold text-blue-900 text-sm">
                    {new Date(serviceRequest.preferredVisitAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {new Date(serviceRequest.preferredVisitAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
              {serviceRequest.assignedVisitAt && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-xs text-slate-600 font-medium uppercase tracking-wide">Assigned</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {new Date(serviceRequest.assignedVisitAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {new Date(serviceRequest.assignedVisitAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {serviceRequest.userId && <UserInfo userData={serviceRequest.userId} />}
          {serviceRequest.images && serviceRequest.images.length > 0 && <ImageGallery images={serviceRequest.images} />}
          {serviceRequest.timeline && serviceRequest.timeline.length > 0 && (
            <Timeline timeline={serviceRequest.timeline} currentUserName={user?.name} />
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        ticket={serviceRequest}
        onReply={onReply}
        updating={updating}
      />
    </>
  );
};

export default ServiceRequestDetailsPanel;



