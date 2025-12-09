import { Clock } from 'lucide-react';

const Timeline = ({ timeline, currentUserName }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
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
                  className={`text-sm leading-relaxed ${
                    isAdmin ? 'text-slate-800' : 'text-slate-700'
                  }`}
                >
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

