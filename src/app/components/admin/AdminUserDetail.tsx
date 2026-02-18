import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Ban,
  MessageSquare,
  User as UserIcon,
  Building
} from 'lucide-react';
import { api, type AdminUser } from '../../services/api';

export function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUser(id);
      setUser(data);
    } catch (e) {
      console.error('Error loading user:', e);
      setError('Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadUser(userId);
  }, [userId]);

  const handleSuspend = async () => {
    if (!userId || !user) return;
    if (!window.confirm(`Suspend ${user.email}? They will not be able to sign in.`)) return;
    setActionLoading(true);
    try {
      await api.suspendAdminUser(userId);
      await loadUser(userId);
    } catch (e) {
      console.error('Suspend failed:', e);
      alert('Failed to suspend user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!userId || !user) return;
    setActionLoading(true);
    try {
      await api.activateAdminUser(userId);
      await loadUser(userId);
    } catch (e) {
      console.error('Activate failed:', e);
      alert('Failed to activate user.');
    } finally {
      setActionLoading(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'business': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pro': return 'bg-green-100 text-green-700 border-green-200';
      case 'starter': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'free': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Active
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <Ban className="w-4 h-4" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">{error ?? 'User not found'}</div>
        <button
          onClick={() => navigate('/admin/users')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">User Details</h2>
          <p className="text-slate-600">Viewing {user.name ?? user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{user.name ?? '—'}</h3>
                <p className="text-slate-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              {getStatusBadge(user.status)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Plan: <span className={`inline-block px-2 py-0.5 border rounded text-xs font-medium uppercase ${getPlanBadgeColor(user.plan)}`}>{user.plan}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Locations</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{user.locations_count}</p>
          <a
            href={`/admin/locations?user_id=${user.id}`}
            className="text-sm text-slate-600 hover:text-slate-900 mt-1 inline-block"
          >
            View locations →
          </a>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Feedback</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{user.feedback_count.toLocaleString()}</p>
          <a
            href={`/admin/feedback?user_id=${user.id}`}
            className="text-sm text-slate-600 hover:text-slate-900 mt-1 inline-block"
          >
            View feedback →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Account actions</h4>
        <div className="flex flex-wrap gap-3">
          {user.status === 'suspended' ? (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Activate user
            </button>
          ) : (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50"
            >
              <Ban className="w-4 h-4" />
              Suspend user
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
