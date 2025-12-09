import { useState } from 'react';
import { X, Send, Clock, MessageSquare, Loader2 } from 'lucide-react';

const timeSlotOptions = [
  { value: '09:00', label: 'Morning (9 AM – 12 PM)' },
  { value: '12:00', label: 'Afternoon (12 PM – 3 PM)' },
  { value: '15:00', label: 'Evening (3 PM – 6 PM)' },
];

const ReplyModal = ({ isOpen, onClose, ticket, onReply, updating }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [errors, setErrors] = useState({ message: '', schedule: '' });

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({ message: '', schedule: '' });

    if (!replyMessage.trim()) {
      setErrors(prev => ({ ...prev, message: 'Reply message is required' }));
      return;
    }

    if (replyMessage.trim().length < 3) {
      setErrors(prev => ({ ...prev, message: 'Reply message must be at least 3 characters long' }));
      return;
    }

    // Scheduling time is now required
    if (!preferredDate || !preferredSlot) {
      setErrors(prev => ({ ...prev, schedule: 'Please select both scheduling date and time slot' }));
      return;
    }
    
    const combined = new Date(`${preferredDate}T${preferredSlot}`);
    const now = new Date();
    if (isNaN(combined.getTime()) || combined < now) {
      setErrors(prev => ({ ...prev, schedule: 'Scheduling time cannot be in the past' }));
      return;
    }
    const visitDateTimeIso = combined.toISOString();

    // Call the parent handler and wait for result
    try {
      const success = await onReply(replyMessage.trim(), visitDateTimeIso);
      
      if (success !== false) {
        setReplyMessage('');
        setPreferredDate('');
        setPreferredSlot('');
        setErrors({ message: '', schedule: '' });
        onClose();
      }
    } catch (error) {
      console.error('Error in reply submission:', error);
    }
  };

  const handleClose = () => {
    if (!updating) {
      setReplyMessage('');
      setPreferredDate('');
      setPreferredSlot('');
      setErrors({ message: '', schedule: '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reply to User</h2>
              <p className="text-sm text-slate-500">
                {ticket?.ticketId ? `Ticket: ${ticket.ticketId}` : ticket?.requestId ? `Service Request: ${ticket.requestId}` : 'Reply'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={updating}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ticket/Service Request Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-1">
              {ticket?.ticketId ? 'Ticket Title:' : ticket?.requestId ? 'Service Request Title:' : 'Title:'}
            </p>
            <p className="text-base font-semibold text-slate-900">{ticket?.title}</p>
            <p className="text-sm font-medium text-slate-700 mt-3 mb-1">User:</p>
            <p className="text-base text-slate-900">{ticket?.userId?.name} ({ticket?.userId?.companyName})</p>
          </div>

          {/* Reply Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Reply Message *
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => {
                setReplyMessage(e.target.value);
                setErrors(prev => ({ ...prev, message: '' }));
              }}
              placeholder="Type your reply message here..."
              rows={6}
              disabled={updating}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent resize-none transition-colors font-medium ${
                errors.message
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-slate-300 focus:ring-blue-500 bg-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Scheduling Date & Time Slot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Scheduling Date *
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => {
                  setPreferredDate(e.target.value);
                  setErrors(prev => ({ ...prev, schedule: '' }));
                }}
                min={today}
                disabled={updating}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors font-medium ${
                  errors.schedule
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Scheduling Time Slot *
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => {
                  setPreferredSlot(e.target.value);
                  setErrors(prev => ({ ...prev, schedule: '' }));
                }}
                disabled={updating}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors font-medium ${
                  errors.schedule
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">Select a scheduling slot</option>
                {timeSlotOptions.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.schedule && (
            <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={updating}
              className="flex-1 px-5 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyMessage.trim() || !preferredDate || !preferredSlot || updating}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg disabled:shadow-sm"
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;

