import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  MessageSquare,
  Star,
  Download,
  Filter,
  X
} from 'lucide-react';
import { api, downloadBlob, type AdminAnalyticsResponse, type AdminLocation, type AdminUser } from '../../../services/api';

const TIME_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '6m', label: '6 months' },
  { value: '1y', label: '1 year' },
  { value: 'all', label: 'All time' },
];

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [filterLocationId, setFilterLocationId] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const hasActiveFilters = timeRange !== 'all' || filterLocationId || filterUserId;

  const analyticsParams = {
    since: timeRange === 'all' ? undefined : timeRange,
    location_id: filterLocationId || undefined,
    user_id: filterUserId || undefined,
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getAdminAnalytics(analyticsParams)
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch(() => { if (!cancelled) setAnalytics(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [timeRange, filterLocationId, filterUserId]);

  useEffect(() => {
    api.getAdminLocations({ per_page: 500 }).then((r) => setLocations(r.locations)).catch(() => setLocations([]));
    api.getAdminUsers({ per_page: 500 }).then((r) => setUsers(r.users)).catch(() => setUsers([]));
  }, []);

  const exportReport = async () => {
    setExporting(true);
    try {
      const blob = await api.exportAdminAnalytics(analyticsParams);
      downloadBlob(blob, `analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed or not yet supported.');
    } finally {
      setExporting(false);
    }
  };

  const clearFilter = (key: 'time' | 'location' | 'user') => {
    if (key === 'time') setTimeRange('all');
    if (key === 'location') setFilterLocationId('');
    if (key === 'user') setFilterUserId('');
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

  const rev = analytics.revenue;
  const users = analytics.users;
  const feedback = analytics.feedback;
  const totalRatings = feedback.rating_distribution.reduce((s, r) => s + r.count, 0);
  const ratingWithPct = feedback.rating_distribution.map((r) => ({
    ...r,
    percentage: totalRatings > 0 ? Math.round((r.count / totalRatings) * 100) : 0,
  }));

  const selectedLocation = locations.find((l) => (l.public_id || l.id) === filterLocationId);
  const selectedUser = users.find((u) => (u.public_id || u.id) === filterUserId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics & Reports</h2>
          <p className="text-slate-600">System-wide performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${showFilters ? 'bg-slate-100 border-slate-300' : 'border-slate-300 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={exportReport}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Time range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {TIME_RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <select
                value={filterLocationId}
                onChange={(e) => setFilterLocationId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.public_id || loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All users</option>
                {users.map((u) => (
                  <option key={u.id} value={u.public_id || u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
              {timeRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {TIME_RANGE_OPTIONS.find((o) => o.value === timeRange)?.label ?? timeRange}
                  <button type="button" onClick={() => clearFilter('time')} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterLocationId && selectedLocation && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                  Location: {selectedLocation.name}
                  <button type="button" onClick={() => clearFilter('location')} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterUserId && selectedUser && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                  User: {selectedUser.name || selectedUser.email}
                  <button type="button" onClick={() => clearFilter('user')} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {Number(rev.total) > 0 ? `$${Number(rev.total).toLocaleString()}` : 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            {rev.total > 0 ? `${rev.growth >= 0 ? '+' : ''}${rev.growth}% vs last period` : 'Billing not configured'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {Number(users.total ?? 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            {users.new_this_month} new this month
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Feedback</span>
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {Number(feedback.total ?? 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            {feedback.growth !== 0 ? `${feedback.growth >= 0 ? '+' : ''}${feedback.growth}% vs last period` : 'All time'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Avg Rating</span>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {feedback.avg_rating != null ? Number(feedback.avg_rating).toFixed(1) : '—'}
          </div>
          <div className="text-sm text-slate-500">Out of 5.0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue by Plan</h3>
          {Array.isArray(rev.by_plan) && rev.by_plan.length > 0 ? (
            <div className="space-y-4">
              {(rev.by_plan as { plan?: string; amount?: number; percentage?: number }[]).map((item, i) => (
                <div key={item.plan ?? i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">{item.plan ?? '—'}</span>
                    <span className="text-sm text-slate-600">
                      ${Number(item.amount ?? 0).toLocaleString()} ({Number(item.percentage ?? 0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-slate-900 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">N/A</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Rating Distribution</h3>
          <div className="space-y-4">
            {ratingWithPct.map((item) => (
              <div key={item.rating}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{item.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-slate-600">
                    {Number(item.count ?? 0).toLocaleString()} ({Number(item.percentage ?? 0)}%)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Top Locations</h3>
            <p className="text-sm text-slate-600 mt-1">By feedback volume</p>
          </div>
          <div className="divide-y divide-slate-200">
            {analytics.top_locations && analytics.top_locations.length > 0 ? (
              analytics.top_locations.map((location, index) => (
                <div
                  key={location.id}
                  onClick={() => navigate(`/admin/locations/${location.public_id || location.id}`)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{location.name}</div>
                      <div className="text-sm text-slate-500">{location.owner ?? '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {(location.feedback_count ?? 0).toLocaleString()} reviews
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {location.avg_rating != null ? Number(location.avg_rating).toFixed(1) : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-sm">No data</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Top Users</h3>
            <p className="text-sm text-slate-600 mt-1">By activity</p>
          </div>
          <div className="divide-y divide-slate-200">
            {analytics.top_users && analytics.top_users.length > 0 ? (
              analytics.top_users.map((user, index) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.public_id || user.id}`)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">
                        {user.plan ?? '—'} • {(user.locations_count ?? 0)} locations
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-sm">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-slate-600 mb-1">Churn Rate</div>
            <div className="text-2xl font-bold text-slate-900">{users.churn_rate}%</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Lower is better</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
