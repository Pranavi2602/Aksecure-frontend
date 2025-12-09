import { Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { getStatusColor, getStatusIcon, getCategoryColor, statusOptions } from './utils.jsx';

const TicketHeader = ({ ticket, updateStatus, setUpdateStatus, visitDateTime, setVisitDateTime, errors, setErrors, updating, onUpdate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 ring-1 ring-slate-100">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {ticket.title}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ring-2 ${getStatusColor(
                ticket.status
              )}`}
            >
              {getStatusIcon(ticket.status)}
              {ticket.status === 'Open' ? 'New' : ticket.status}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-3">
            Ticket ID: <span className="font-mono font-bold text-slate-700">{ticket.ticketId}</span>
          </p>
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(ticket.category)}`}>
            {ticket.category}
          </span>
        </div>
        {/* Update Ticket Form - Top Right */}
        <div className="ml-4 w-80 flex-shrink-0">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Update Ticket
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
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={onUpdate}
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
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{ticket.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Created</span>
          </div>
          <p className="font-semibold text-slate-900 text-sm">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(ticket.createdAt).toLocaleTimeString()}
          </p>
        </div>
        {ticket.preferredVisitAt && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">Preferred</span>
            </div>
            <p className="font-semibold text-blue-900 text-sm">
              {new Date(ticket.preferredVisitAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              {new Date(ticket.preferredVisitAt).toLocaleTimeString()}
            </p>
          </div>
        )}
        {ticket.assignedVisitAt && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium uppercase tracking-wide">Assigned</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">
              {new Date(ticket.assignedVisitAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {new Date(ticket.assignedVisitAt).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketHeader;

