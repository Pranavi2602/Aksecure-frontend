import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TicketForm from './TicketForm';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceSelectionDialog from './ServiceSelectionDialog';
import AdminReplies from './AdminReplies';
import { Shield, LogOut, User as UserIcon, Ticket } from 'lucide-react';

const categories = ['CCTV', 'Fire Alarm', 'Security Alarm', 'Electrical', 'Plumbing', 'Air Conditioning'];

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showServiceRequestForm, setShowServiceRequestForm] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect admins to admin portal
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowServiceDialog(true);
  };

  const handleNewService = () => {
    setShowServiceRequestForm(true);
    setShowServiceDialog(false);
  };

  const handleQueryRaising = () => {
    setShowTicketForm(true);
    setShowServiceDialog(false);
  };

  const handleTicketCreated = () => {
    setShowTicketForm(false);
    setSelectedCategory(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleServiceRequestCreated = () => {
    setShowServiceRequestForm(false);
    setSelectedCategory(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowTicketForm(false);
    setShowServiceRequestForm(false);
    setSelectedCategory(null);
  };

  const handleCloseDialog = () => {
    setShowServiceDialog(false);
    setSelectedCategory(null);
  };

  if (showTicketForm) {
    return (
      <TicketForm
        category={selectedCategory}
        onSuccess={handleTicketCreated}
        onCancel={handleCancel}
      />
    );
  }

  if (showServiceRequestForm) {
    return (
      <ServiceRequestForm
        category={selectedCategory}
        onSuccess={handleServiceRequestCreated}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">AK SecureTech Ltd</p>
                <p className="text-xs text-slate-500">Service Ticket Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/tickets')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <Ticket className="w-4 h-4" />
                My Tickets
              </button>
              <button
                onClick={() => navigate('/service-requests')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <Ticket className="w-4 h-4" />
                My Service Requests
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-900">{user?.name}</span>
                  <span className="text-xs text-slate-500">{user?.companyName}</span>
                </div>
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-slate-600">
              Installation and Services for CCTV, Fire Alarm, Security Alarm, Electrical, Plumbing & Air Conditioning
            </p>
          </div>
        </header>

        {/* Service Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
              Service categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900 mb-1">{category}</p>
                    <p className="text-xs text-slate-500">
                      Create a ticket related to {category.toLowerCase()} services.
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                    <span className="text-xl">✦</span>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600">
                  Raise ticket
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Admin Replies */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
              Admin Replies
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
            <AdminReplies key={refreshKey} refreshKey={refreshKey} />
          </div>
        </section>
      </main>

      {/* Service Selection Dialog */}
      <ServiceSelectionDialog
        isOpen={showServiceDialog}
        onClose={handleCloseDialog}
        onNewService={handleNewService}
        onQueryRaising={handleQueryRaising}
        category={selectedCategory}
      />
    </div>
  );
};

export default UserDashboard;