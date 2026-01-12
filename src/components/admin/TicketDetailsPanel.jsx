import { Shield, MessageSquare, Trash2 } from 'lucide-react';
import TicketHeader from './TicketHeader';
import UserInfo from './UserInfo';
import ImageGallery from './ImageGallery';
import Timeline from './Timeline';
import ReplyModal from './ReplyModal';

const TicketDetailsPanel = ({
  ticket,
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
  onUpdateTicket,
  onAddComment,
  showReplyModal,
  setShowReplyModal,
  onReply,
  onDelete
}) => {
  if (!ticket) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ring-4 ring-slate-50">
              <Shield className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">Select a ticket to view details</p>
            <p className="text-sm text-slate-500">Click on any ticket from the left panel to see full information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <div className="p-6 space-y-6">
          {/* Reply and Delete Buttons */}
          <div className="flex justify-end gap-3 mb-2">
            <button
              onClick={() => setShowReplyModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Reply to User
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
                Delete Ticket
              </button>
            )}
          </div>

          <TicketHeader 
            ticket={ticket}
            updateStatus={updateStatus}
            setUpdateStatus={setUpdateStatus}
            visitDateTime={visitDateTime}
            setVisitDateTime={setVisitDateTime}
            errors={errors}
            setErrors={setErrors}
            updating={updating}
            onUpdate={onUpdateTicket}
          />
          {ticket.userId && <UserInfo userData={ticket.userId} />}
          {ticket.images && ticket.images.length > 0 && <ImageGallery images={ticket.images} />}
          {ticket.timeline && ticket.timeline.length > 0 && (
            <Timeline timeline={ticket.timeline} currentUserName={user?.name} />
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        ticket={ticket}
        onReply={onReply}
        updating={updating}
      />
    </>
  );
};

export default TicketDetailsPanel;

