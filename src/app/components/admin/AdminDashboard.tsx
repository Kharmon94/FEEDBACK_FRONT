import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Star,
  Activity
} from 'lucide-react';
import { api, type AdminRecentActivityItem } from '../../../services/api';

export function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<AdminRecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getAdminDashboard();
      setTotalUsers(Number(data.total_users) || 0);
      setActiveUsers(Number(data.active_users) || 0);
      setTotalLocations(Number(data.total_locations) || 0);
      setTotalFeedback(Number(data.total_feedback) || 0);
      setAvgRating(data.avg_rating != null ? Number(data.avg_rating) : null);
      setRecentActivity(data.recent_activity || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: (typeof totalUsers === 'number' ? totalUsers : 0).toLocaleString(),
      subtext: 'Registered accounts',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: (typeof activeUsers === 'number' ? activeUsers : 0).toLocaleString(),
      subtext: totalUsers > 0 ? `${(Number(activeUsers) / Number(totalUsers) * 100).toFixed(0)}% of total` : 'Not suspended',
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      label: 'Total Locations',
      value: (typeof totalLocations === 'number' ? totalLocations : 0).toLocaleString(),
      subtext: 'Across all users',
      icon: MapPin,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Feedback',
      value: (typeof totalFeedback === 'number' ? totalFeedback : 0).toLocaleString(),
      subtext: 'Submissions',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      label: 'Avg Rating',
      value: avgRating != null ? Number(avgRating).toFixed(1) : '—',
      subtext: 'System-wide average',
      icon: Star,
      color: 'bg-yellow-500',
    },
  ];

  const getActivityIcon = (type: AdminRecentActivityItem['type']) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'feedback':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: AdminRecentActivityItem['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-700';
      case 'location':
        return 'bg-purple-100 text-purple-700';
      case 'feedback':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatActivityTime = (createdAt: string) => {
    const d = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
        <p className="text-slate-600">System-wide overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-500">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          <p className="text-sm text-slate-600 mt-1">Latest system events and updates</p>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`${getActivityColor(activity.type)} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      {activity.user_name && <span>{activity.user_name}</span>}
                      {activity.location_name && (
                        <>
                          {activity.user_name && <span>•</span>}
                          <span>{activity.location_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 flex-shrink-0">
                    {formatActivityTime(activity.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
            <h4 className="font-semibold text-slate-900">User Management</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Manage user accounts, permissions, and subscriptions
          </p>
          <button 
            onClick={() => navigate('/admin/users')}
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            View Users
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-700" />
            </div>
            <h4 className="font-semibold text-slate-900">Locations</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            View and manage all locations across the platform
          </p>
          <button 
            onClick={() => navigate('/admin/locations')}
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            View Locations
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-700" />
            </div>
            <h4 className="font-semibold text-slate-900">Feedback</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Monitor and analyze all feedback submissions
          </p>
          <button 
            onClick={() => navigate('/admin/feedback')}
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            View Feedback
          </button>
        </div>
      </div>
    </div>
  );
}