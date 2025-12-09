import { AlertCircle, Loader2, XCircle } from 'lucide-react';

const TicketStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-lg p-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-emerald-700 font-medium">New</span>
        </div>
        <p className="text-lg font-bold text-emerald-900">{stats.new}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Loader2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="text-xs text-blue-700 font-medium">In Progress</span>
        </div>
        <p className="text-lg font-bold text-blue-900">{stats.inProgress}</p>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-lg p-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <XCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-700 font-medium">Closed</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{stats.closed}</p>
      </div>
    </div>
  );
};

export default TicketStats;

