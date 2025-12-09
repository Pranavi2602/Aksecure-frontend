import { X, Wrench, MessageSquare } from 'lucide-react';

const ServiceSelectionDialog = ({ isOpen, onClose, onNewService, onQueryRaising, category }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Select Option</h2>
              <p className="text-sm text-slate-500">Category: {category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-600 mb-6">
            What would you like to do for <strong>{category}</strong>?
          </p>

          <button
            onClick={() => {
              onNewService();
            }}
            className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:border-emerald-400 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-1">New Service</h3>
                <p className="text-sm text-slate-600">
                  Request a new installation or service
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onQueryRaising();
            }}
            className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-1">Query Raising</h3>
                <p className="text-sm text-slate-600">
                  Raise a ticket for an issue or query
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionDialog;



