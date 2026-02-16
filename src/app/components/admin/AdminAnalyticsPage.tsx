import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  MessageSquare,
  Star,
  Calendar,
  Download
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    byPlan: { plan: string; amount: number; percentage: number }[];
  };
  users: {
    total: number;
    growth: number;
    newThisMonth: number;
    churnRate: number;
  };
  feedback: {
    total: number;
    growth: number;
    avgRating: number;
    ratingDistribution: { rating: number; count: number; percentage: number }[];
  };
  topLocations: {
    id: string;
    name: string;
    owner: string;
    feedbackCount: number;
    avgRating: number;
  }[];
  topUsers: {
    id: string;
    name: string;
    plan: string;
    mrr: number;
    locationsCount: number;
  }[];
}

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      // const data = await response.json();
      
      // Mock data for now
      setAnalytics({
        revenue: {
          total: 45670,
          growth: 12.5,
          byPlan: [
            { plan: 'Starter', amount: 8670, percentage: 19 },
            { plan: 'Pro', amount: 17700, percentage: 39 },
            { plan: 'Business', amount: 14850, percentage: 32 },
            { plan: 'Enterprise', amount: 4450, percentage: 10 },
          ],
        },
        users: {
          total: 1247,
          growth: 8.3,
          newThisMonth: 156,
          churnRate: 2.1,
        },
        feedback: {
          total: 28934,
          growth: 15.7,
          avgRating: 4.2,
          ratingDistribution: [
            { rating: 5, count: 14250, percentage: 49 },
            { rating: 4, count: 7820, percentage: 27 },
            { rating: 3, count: 3470, percentage: 12 },
            { rating: 2, count: 2310, percentage: 8 },
            { rating: 1, count: 1084, percentage: 4 },
          ],
        },
        topLocations: [
          { id: '1', name: 'Harbor View Restaurant', owner: 'David Lee', feedbackCount: 892, avgRating: 4.5 },
          { id: '2', name: 'Main Street Cafe', owner: 'Sarah Johnson', feedbackCount: 289, avgRating: 4.7 },
          { id: '3', name: 'Downtown Store', owner: 'John Smith', feedbackCount: 156, avgRating: 4.3 },
          { id: '4', name: 'West Side Shop', owner: 'John Smith', feedbackCount: 67, avgRating: 3.9 },
          { id: '5', name: 'Plaza Boutique', owner: 'Mike Chen', feedbackCount: 45, avgRating: 4.6 },
        ],
        topUsers: [
          { id: '1', name: 'David Lee', plan: 'Enterprise', mrr: 299, locationsCount: 25 },
          { id: '2', name: 'Sarah Johnson', plan: 'Business', mrr: 99, locationsCount: 8 },
          { id: '3', name: 'John Smith', plan: 'Pro', mrr: 59, locationsCount: 3 },
          { id: '4', name: 'Mike Chen', plan: 'Starter', mrr: 29, locationsCount: 1 },
          { id: '5', name: 'Lisa Wang', plan: 'Pro', mrr: 59, locationsCount: 5 },
        ],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // TODO: Implement report export
    alert('Export analytics report - TODO: Implement with Rails backend');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics & Reports</h2>
          <p className="text-slate-600">System-wide performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            ${analytics.revenue.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">+{analytics.revenue.growth}%</span>
            <span className="text-slate-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {analytics.users.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">+{analytics.users.growth}%</span>
            <span className="text-slate-500">({analytics.users.newThisMonth} new)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Feedback</span>
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {analytics.feedback.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">+{analytics.feedback.growth}%</span>
            <span className="text-slate-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Avg Rating</span>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {analytics.feedback.avgRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-500">Out of 5.0</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown and Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {analytics.revenue.byPlan.map((item) => (
              <div key={item.plan}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{item.plan}</span>
                  <span className="text-sm text-slate-600">
                    ${item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Rating Distribution</h3>
          <div className="space-y-4">
            {analytics.feedback.ratingDistribution.map((item) => (
              <div key={item.rating}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{item.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-slate-600">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Top Locations</h3>
            <p className="text-sm text-slate-600 mt-1">By feedback volume</p>
          </div>
          <div className="divide-y divide-slate-200">
            {analytics.topLocations.map((location, index) => (
              <div 
                key={location.id} 
                onClick={() => navigate(`/admin/locations/${location.id}`)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{location.name}</div>
                    <div className="text-sm text-slate-500">{location.owner}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">
                      {location.feedbackCount} reviews
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {location.avgRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Top Users</h3>
            <p className="text-sm text-slate-600 mt-1">By monthly revenue</p>
          </div>
          <div className="divide-y divide-slate-200">
            {analytics.topUsers.map((user, index) => (
              <div 
                key={user.id} 
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.plan} • {user.locationsCount} locations</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">
                      ${user.mrr}/mo
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-slate-600 mb-1">Churn Rate</div>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.users.churnRate}%
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Lower is better</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Avg Locations per User</div>
            <div className="text-2xl font-bold text-slate-900">
              2.8
            </div>
            <div className="text-sm text-slate-500 mt-1">Across all users</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Avg Feedback per Location</div>
            <div className="text-2xl font-bold text-slate-900">
              8.4
            </div>
            <div className="text-sm text-slate-500 mt-1">Per month</div>
          </div>
        </div>
      </div>
    </div>
  );
}