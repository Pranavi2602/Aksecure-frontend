import { User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { getGoogleMapsUrl } from './utils.jsx';

const UserInfo = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 ring-1 ring-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center ring-2 ring-slate-100">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">User Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Name</span>
          </div>
          <p className="font-semibold text-slate-900">{userData.name}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Company</span>
          </div>
          <p className="font-semibold text-slate-900">
            {userData.companyName || 'N/A'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</span>
          </div>
          <p className="font-semibold text-slate-900 break-all">{userData.email}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</span>
          </div>
          <p className="font-semibold text-slate-900">
            {userData.phone || 'N/A'}
          </p>
        </div>
        {userData.address && (
          <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Address</span>
            </div>
            <p className="font-semibold text-slate-900">{userData.address}</p>
          </div>
        )}
        {userData.location && (
          <div className="md:col-span-2">
            <a
              href={getGoogleMapsUrl({ userId: { location: userData.location } })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
            >
              <MapPin className="w-4 h-4" />
              View on Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;

