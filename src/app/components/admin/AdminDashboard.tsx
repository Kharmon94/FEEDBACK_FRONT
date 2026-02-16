import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalLocations: number;
  totalFeedback: number;
  avgRating: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  feedbackThisMonth: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'location' | 'feedback' | 'subscription';
  message: string;
  timestamp: string;
  userName?: string;
  locationName?: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLocations: 0,
    totalFeedback: 0,
    avgRating: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
    feedbackThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      
      // Mock data for now
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalLocations: 3456,
        totalFeedback: 28934,
        avgRating: 4.2,
        monthlyRevenue: 45670,
        newUsersThisMonth: 156,
        feedbackThisMonth: 2847,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'user',
          message: 'New user registration',
          timestamp: '2 minutes ago',
          userName: 'John Smith',
        },
        {
          id: '2',
          type: 'subscription',
          message: 'Upgraded to Pro plan',
          timestamp: '15 minutes ago',
          userName: 'Sarah Johnson',
        },
        {
          id: '3',
          type: 'location',
          message: 'New location added',
          timestamp: '1 hour ago',
          locationName: 'Downtown Store',
          userName: 'Mike Chen',
        },
        {
          id: '4',
          type: 'feedback',
          message: 'New feedback submission (5 stars)',
          timestamp: '2 hours ago',
          locationName: 'Main Street Cafe',
        },
        {
          id: '5',
          type: 'feedback',
          message: 'New feedback submission (2 stars)',
          timestamp: '3 hours ago',
          locationName: 'West Side Shop',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      subtext: `${stats.newUsersThisMonth} new this month`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      subtext: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}% of total`,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      label: 'Total Locations',
      value: stats.totalLocations.toLocaleString(),
      subtext: `Across all users`,
      icon: MapPin,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Feedback',
      value: stats.totalFeedback.toLocaleString(),
      subtext: `${stats.feedbackThisMonth.toLocaleString()} this month`,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      label: 'Avg Rating',
      value: stats.avgRating.toFixed(1),
      subtext: 'System-wide average',
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      subtext: 'Current month',
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'feedback':
        return <MessageSquare className="w-4 h-4" />;
      case 'subscription':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-700';
      case 'location':
        return 'bg-purple-100 text-purple-700';
      case 'feedback':
        return 'bg-orange-100 text-orange-700';
      case 'subscription':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`${getActivityColor(activity.type)} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      {activity.userName && <span>{activity.userName}</span>}
                      {activity.locationName && (
                        <>
                          {activity.userName && <span>•</span>}
                          <span>{activity.locationName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 flex-shrink-0">
                    {activity.timestamp}
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