import { useState, useEffect } from 'react';
import { Star, Download, Search, Filter, X, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, Smartphone, Globe, MapPin, Calendar, Mail } from 'lucide-react';
import { api } from '../../api/client';

interface Feedback {
  id: string;
  businessId: string;
  locationId?: string;
  locationName?: string;
  rating: number;
  name?: string;
  email?: string;
  comment: string;
  type: 'feedback' | 'suggestion';
  createdAt: Date | string;
  deviceType?: string;
  country?: string;
  region?: string;
}

function getSentimentLabel(rating: number): string {
  if (rating >= 4) return `Positive (${rating}★)`;
  return `Needs attention (${rating}★)`;
}

function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color] || colorClasses.blue} flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function FeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterDevice, setFilterDevice] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{
    funnel: { page_views: number; star_clicks: number; submissions: number };
    device_breakdown: Record<string, number>;
    top_countries: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    api.getFeedbackAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterRating, filterDevice, filterCountry, filterLocation, feedback]);

  const loadFeedback = async () => {
    try {
      const data = await api.getFeedback();
      setFeedback(data);
      setFilteredFeedback(data);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedback];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (filterRating !== null) {
      filtered = filtered.filter(f => f.rating === filterRating);
    }

    // Device filter
    if (filterDevice) {
      filtered = filtered.filter(f => (f.deviceType || 'unknown') === filterDevice);
    }

    // Country filter
    if (filterCountry) {
      filtered = filtered.filter(f => (f.country || '') === filterCountry);
    }

    // Location filter
    if (filterLocation) {
      filtered = filtered.filter(f => String(f.locationId || f.businessId) === filterLocation);
    }

    setFilteredFeedback(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Rating', 'Name', 'Email', 'Comment', 'Location', 'Device', 'Country', 'Region'];
    const rows = filteredFeedback.map(f => [
      new Date(f.createdAt).toLocaleDateString(),
      f.rating,
      f.name || '',
      f.email || '',
      f.comment || '',
      f.locationName || '',
      f.deviceType || '',
      f.country || '',
      f.region || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalFeedback = feedback.length;
  const positiveCount = feedback.filter(f => Number(f.rating) >= 4).length;
  const negativeCount = feedback.filter(f => Number(f.rating) <= 3).length;
  const averageRating = totalFeedback > 0
    ? (feedback.reduce((sum, f) => sum + Number(f.rating), 0) / totalFeedback)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" data-tour="stats-overview">
        <StatCard icon={MessageSquare} label="Total Feedback" value={totalFeedback} color="blue" />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={typeof averageRating === 'number' && !isNaN(averageRating) ? averageRating.toFixed(1) : '0.0'}
          color="yellow"
        />
        <StatCard icon={ThumbsUp} label="Positive (4-5★)" value={positiveCount} color="green" />
        <StatCard icon={ThumbsDown} label="Needs Attention (1-3★)" value={negativeCount} color="red" />
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Funnel & Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Funnel */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Feedback Funnel</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Page views</span>
                  <span className="font-semibold">{analytics.funnel.page_views}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Star clicks</span>
                  <span className="font-semibold">{analytics.funnel.star_clicks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Submissions</span>
                  <span className="font-semibold">{analytics.funnel.submissions}</span>
                </div>
                {analytics.funnel.page_views > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                    Conversion: {((analytics.funnel.submissions / analytics.funnel.page_views) * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
            {/* Device breakdown */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1">
                <Smartphone className="w-4 h-4" /> Devices
              </h4>
              {Object.keys(analytics.device_breakdown).length === 0 ? (
                <p className="text-sm text-slate-500">No device data yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(analytics.device_breakdown).map(([device, count]) => (
                    <div key={device} className="flex justify-between text-sm">
                      <span className="text-slate-600 capitalize">{device}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Top countries */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1">
                <Globe className="w-4 h-4" /> Top Countries
              </h4>
              {Object.keys(analytics.top_countries).length === 0 ? (
                <p className="text-sm text-slate-500">No location data yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(analytics.top_countries).slice(0, 5).map(([country, count]) => (
                    <div key={country} className="flex justify-between text-sm">
                      <span className="text-slate-600">{country}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header with Action Icons */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl text-black">All Feedback</h2>
          <p className="text-gray-600 mt-1">{filteredFeedback.length} items</p>
        </div>
        
        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-black text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
            title="Filter Feedback"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={exportToCSV}
            className="p-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Export to CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={filterRating ?? ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* Device Filter */}
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All Devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="unknown">Unknown</option>
            </select>

            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All Countries</option>
              {Array.from(new Set(feedback.map(f => f.country).filter(Boolean) as string[]))
                .sort()
                .map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {/* Location Filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All Locations</option>
              {Array.from(
                new Map(
                  feedback
                    .filter(f => f.locationName || f.locationId)
                    .map(f => [f.locationId || f.businessId, f.locationName || 'Unknown'])
                ).entries()
              )
                .sort((a, b) => (a[1] || '').localeCompare(b[1] || ''))
                .map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
            </select>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterRating !== null || filterDevice || filterCountry || filterLocation) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Search: {searchTerm}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filterRating !== null && (
                <button
                  onClick={() => setFilterRating(null)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  {filterRating} Stars
                  <X className="w-3 h-3" />
                </button>
              )}
              {filterDevice && (
                <button
                  onClick={() => setFilterDevice('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Device: {filterDevice}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filterCountry && (
                <button
                  onClick={() => setFilterCountry('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Country: {filterCountry}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filterLocation && (
                <button
                  onClick={() => setFilterLocation('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Location
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feedback List */}
      <div data-tour="recent-feedback">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-600">No feedback found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Rating</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Comment / Sentiment</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedback.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
                        onClick={() => setDetailId(item.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.comment ? (
                            <p className="text-slate-700 line-clamp-2">{item.comment}</p>
                          ) : (
                            <span className={item.rating >= 4 ? 'text-green-600' : 'text-amber-600'}>
                              {getSentimentLabel(item.rating)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            <span>{item.locationName || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            {formatRelative(item.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setDetailId(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setDetailId(item.id)}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex flex-shrink-0 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.comment ? (
                        <p className="text-slate-700 line-clamp-2">{item.comment}</p>
                      ) : (
                        <span className={item.rating >= 4 ? 'text-green-600 text-sm font-medium' : 'text-amber-600 text-sm font-medium'}>
                          {getSentimentLabel(item.rating)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
                      {formatRelative(item.createdAt)}
                    </span>
                    {item.locationName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        {item.locationName}
                      </span>
                    )}
                    {item.deviceType && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{item.deviceType}</span>
                    )}
                    {(item.country || item.region) && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                        {[item.region, item.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Modal */}
            {detailId && (() => {
              const item = filteredFeedback.find((f) => f.id === detailId);
              if (!item) return null;
              return (
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setDetailId(null)}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="feedback-detail-title"
                >
                  <div
                    className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h3 id="feedback-detail-title" className="sr-only">
                        Feedback details
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={item.rating >= 4 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                          {getSentimentLabel(item.rating)}
                        </span>
                      </div>
                      {item.comment ? (
                        <p className="text-slate-900 mb-4 whitespace-pre-wrap">{item.comment}</p>
                      ) : (
                        <p className="text-slate-500 mb-4 italic">No comment provided</p>
                      )}
                      <div className="text-sm text-slate-600 space-y-2 mb-6">
                        {(item.name || item.email) && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            {item.name && <span>{item.name}</span>}
                            {item.email && <span>{item.email}</span>}
                          </div>
                        )}
                        {item.locationName && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {item.locationName}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                        {(item.deviceType || item.country || item.region) && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {item.deviceType && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{item.deviceType}</span>
                            )}
                            {(item.country || item.region) && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                {[item.region, item.country].filter(Boolean).join(', ')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                        onClick={() => setDetailId(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}