import { AlertCircle, Loader2, CheckCircle2, XCircle, CircleDot } from 'lucide-react';

const normalizeStatus = (status) => {
  if (status === 'Open') return 'New';
  return status;
};

export const getStatusColor = (status) => {
  const normalizedStatus = normalizeStatus(status);
  const colors = {
    'New': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
    'Closed': 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100'
  };
  return colors[normalizedStatus] || 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100';
};

export const getStatusIcon = (status) => {
  const normalizedStatus = normalizeStatus(status);
  switch (normalizedStatus) {
    case 'New':
      return <AlertCircle className="w-3.5 h-3.5" />;
    case 'In Progress':
      return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
    case 'Closed':
      return <XCircle className="w-3.5 h-3.5" />;
    default:
      return <CircleDot className="w-3.5 h-3.5" />;
  }
};

export const getCategoryColor = (category) => {
  const colors = {
    'CCTV': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Fire Alarm': 'bg-red-100 text-red-700 border-red-200',
    'Security Alarm': 'bg-orange-100 text-orange-700 border-orange-200',
    'Electrical': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Plumbing': 'bg-blue-100 text-blue-700 border-blue-200',
    'Air Conditioning': 'bg-green-100 text-green-700 border-green-200'
  };
  return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
};

export const getTicketStats = (tickets) => {
  return {
    total: tickets.length,
    new: tickets.filter(t => normalizeStatus(t.status) === 'New').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    closed: tickets.filter(t => t.status === 'Closed').length
  };
};

export const getServiceRequestStats = (serviceRequests) => {
  return {
    total: serviceRequests.length,
    new: serviceRequests.filter(sr => sr.status === 'New').length,
    inProgress: serviceRequests.filter(sr => sr.status === 'In Progress').length,
    completed: serviceRequests.filter(sr => sr.status === 'Completed').length
  };
};

export const getGoogleMapsUrl = (ticket) => {
  if (!ticket.location || !ticket.userId?.location) return null;
  const location = ticket.userId.location;
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

export const statusOptions = ['New', 'In Progress', 'Closed'];

