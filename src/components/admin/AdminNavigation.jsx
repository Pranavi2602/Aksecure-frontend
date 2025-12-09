import { Shield, LogOut, Ticket as TicketIcon, Users } from 'lucide-react';

const AdminNavigation = ({ user, logout, activeTab, setActiveTab, onTicketsClick, onUsersClick }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg ring-2 ring-slate-100">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 tracking-tight">Admin Portal</p>
              <p className="text-xs text-slate-500">Ticket management system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center ring-2 ring-slate-100">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-900">sivadass</span>
                <span className="text-xs text-slate-600 font-medium">Administrator</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;

