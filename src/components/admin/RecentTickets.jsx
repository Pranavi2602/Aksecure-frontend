import { Clock, Calendar } from 'lucide-react';
import { getStatusColor, getStatusIcon, getCategoryColor } from './utils.jsx';

const RecentTickets = ({ tickets, selectedTicket, onTicketClick }) => {
  if (!tickets || tickets.length === 0) return null;

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recent Tickets</h3>
          </div>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
            Latest 5
          </span>
        </div>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <button
              key={ticket._id}
              onClick={() => onTicketClick(ticket)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedTicket?._id === ticket._id
                  ? 'border-slate-500 bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-xs mb-0.5 line-clamp-1">
                    {ticket.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-600 text-[10px]">{ticket.ticketId}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {getStatusIcon(ticket.status)}
                  {ticket.status === 'Open' ? 'New' : ticket.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getCategoryColor(ticket.category)}`}>
                  {ticket.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTickets;

