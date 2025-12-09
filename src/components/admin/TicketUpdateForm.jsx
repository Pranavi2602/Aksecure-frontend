import { Save, Clock, Loader2 } from 'lucide-react';
import { statusOptions } from './utils.jsx';

const TicketUpdateForm = ({
  updateStatus,
  setUpdateStatus,
  visitDateTime,
  setVisitDateTime,
  errors,
  setErrors,
  updating,
  onUpdate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 ring-1 ring-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center ring-2 ring-slate-100">
          <Save className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Update Ticket</h3>
      </div>
      <div className="space-y-4">
        {errors.update && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errors.update}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={updateStatus}
            onChange={(e) => {
              setUpdateStatus(e.target.value);
              setErrors(prev => ({ ...prev, status: '', update: '' }));
            }}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors font-medium ${
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
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Assign Visit Time
          </label>
          <input
            type="datetime-local"
            value={visitDateTime}
            onChange={(e) => {
              setVisitDateTime(e.target.value);
              setErrors(prev => ({ ...prev, visitDateTime: '', update: '' }));
            }}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors font-medium ${
              errors.visitDateTime || errors.update
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-slate-300 focus:ring-slate-500 bg-white'
            }`}
          />
          {errors.visitDateTime && (
            <p className="mt-1 text-sm text-red-600">{errors.visitDateTime}</p>
          )}
        </div>

        <button
          onClick={onUpdate}
          disabled={updating}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg disabled:shadow-sm"
        >
          {updating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Update Ticket
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TicketUpdateForm;

