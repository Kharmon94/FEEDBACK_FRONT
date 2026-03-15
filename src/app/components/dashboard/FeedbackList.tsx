import { useState, useEffect } from 'react';
import { Star, Download, Search, Filter, X, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, Smartphone, Globe, MapPin, Calendar, Mail, User, Trash2 } from 'lucide-react';
import { api } from '../../api/client';

interface Suggestion {
  id: string;
  content: string;
  submitterEmail: string | null;
  locationId: string | null;
  createdAt: string;
  locationName?: string;
}

interface OptIn {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  createdAt: string;
  rating?: number;
  locationId?: string;
}

interface Location {
  id: string;
  name: string;
}

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

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
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

type TimeRange = 'today' | '7d' | '30d' | '90d' | '6m' | '1y' | 'all';

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  today: 'Today',
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  '6m': '6 months',
  '1y': '1 year',
  all: 'All time',
};

type TableType = 'feedback' | 'suggestions' | 'opt-ins';

const TABLE_TYPE_LABELS: Record<TableType, string> = {
  feedback: 'Feedback',
  suggestions: 'Suggestions',
  'opt-ins': 'Opt-Ins',
};

export function FeedbackList() {
  const [tableType, setTableType] = useState<TableType>('feedback');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [optIns, setOptIns] = useState<OptIn[]>([]);
  const [filteredOptIns, setFilteredOptIns] = useState<OptIn[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterDevice, setFilterDevice] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [feedbackLocation, setFeedbackLocation] = useState<string>('');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [suggestionLocation, setSuggestionLocation] = useState<string>('all');
  const [optInLocation, setOptInLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [analytics, setAnalytics] = useState<{
    funnel: { page_views: number; star_clicks_by_rating: Record<number, number>; submissions: number; opt_ins_count: number };
    device_breakdown: Record<string, number>;
    top_countries: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    if (tableType === 'feedback') loadFeedback();
    else if (tableType === 'suggestions') loadSuggestions();
    else loadOptIns();
  }, [tableType, timeRange, feedbackLocation]);

  useEffect(() => {
    if (tableType === 'feedback') {
      const since = timeRange === 'all' ? undefined : timeRange;
      const locId = feedbackLocation || undefined;
      api.getFeedbackAnalytics(since, locId).then(setAnalytics).catch(() => setAnalytics(null));
    }
  }, [tableType, timeRange, feedbackLocation]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterRating, filterDevice, filterCountry, feedback]);

  useEffect(() => {
    let filtered = suggestions;
    if (suggestionSearch) {
      filtered = filtered.filter(s =>
        s.content?.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
        s.submitterEmail?.toLowerCase().includes(suggestionSearch.toLowerCase())
      );
    }
    if (suggestionLocation !== 'all') {
      filtered = filtered.filter(s => s.locationId === suggestionLocation);
    }
    setFilteredSuggestions(filtered);
  }, [suggestionSearch, suggestionLocation, suggestions]);

  useEffect(() => {
    const filtered = optInLocation === 'all' ? optIns : optIns.filter(o => o.locationId === optInLocation);
    setFilteredOptIns(filtered);
  }, [optInLocation, optIns]);

  useEffect(() => {
    setVisibleCount(6);
  }, [tableType, filteredFeedback, filteredSuggestions, filteredOptIns]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const [locsData, feedbackData] = await Promise.all([
        api.getLocations(),
        api.getFeedback(undefined, timeRange === 'all' ? undefined : timeRange, feedbackLocation || undefined),
      ]);
      setLocations(locsData);
      setFeedback(feedbackData);
      setFilteredFeedback(feedbackData);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const [locsData, suggestionsData] = await Promise.all([api.getLocations(), api.getSuggestions()]);
      setLocations(locsData);
      setSuggestions(suggestionsData);
      setFilteredSuggestions(suggestionsData);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptIns = async () => {
    setLoading(true);
    try {
      const [locsData, optInsData] = await Promise.all([api.getLocations(), api.getOptIns()]);
      setLocations(locsData);
      setOptIns(optInsData);
      setFilteredOptIns(optInsData);
    } catch (error) {
      console.error('Failed to load opt-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    if (!confirm('Delete this suggestion? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteSuggestion(id);
      setSuggestions(prev => prev.filter(s => s.id !== id));
      setDetailId(null);
    } catch (e) {
      console.error('Failed to delete suggestion:', e);
      alert('Failed to delete suggestion. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteOptIn = async (id: string) => {
    if (!confirm('Delete this opt-in? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteOptIn(id);
      setOptIns(prev => prev.filter(o => o.id !== id));
      setDetailId(null);
    } catch (e) {
      console.error('Failed to delete opt-in:', e);
      alert('Failed to delete opt-in. Please try again.');
    } finally {
      setDeleting(false);
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

    // Rating filter (Number() so API string/number both work)
    if (filterRating !== null) {
      filtered = filtered.filter(f => Number(f.rating) === filterRating);
    }

    // Device filter
    if (filterDevice) {
      filtered = filtered.filter(f => (f.deviceType || 'unknown') === filterDevice);
    }

    // Country filter
    if (filterCountry) {
      filtered = filtered.filter(f => (f.country || '') === filterCountry);
    }

    setFilteredFeedback(filtered);
  };

  const exportToCSV = () => {
    if (tableType === 'feedback') {
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
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell)}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (tableType === 'suggestions') {
      const headers = ['Content', 'Email', 'Date', 'Location'];
      const rows = filteredSuggestions.map(s => [
        (s.content || '').replace(/"/g, '""'),
        s.submitterEmail || '',
        formatDate(s.createdAt),
        s.locationName || 'N/A',
      ]);
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suggestions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const headers = ['Name', 'Email', 'Phone', 'Rating', 'Date', 'Location'];
      const rows = filteredOptIns.map(o => [
        (o.name || 'Anonymous').replace(/"/g, '""'),
        (o.email || '').replace(/"/g, '""'),
        (o.phone || '').replace(/"/g, '""'),
        String(o.rating ?? 'N/A'),
        formatDate(o.createdAt),
        (locations.find(l => l.id === o.locationId)?.name || 'N/A').replace(/"/g, '""'),
      ]);
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opt-ins-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Cards match Analytics section: Total = Submissions, Positive/Needs Attention/Average from star_clicks_by_rating (1★–5★)
  const starByRating = tableType === 'feedback' && analytics?.funnel?.star_clicks_by_rating
    ? analytics.funnel.star_clicks_by_rating
    : null;
  const totalFeedback = (tableType === 'feedback' && analytics?.funnel?.submissions != null)
    ? analytics.funnel.submissions
    : feedback.length;
  const positiveCount = starByRating != null
    ? (starByRating[4] ?? 0) + (starByRating[5] ?? 0)
    : feedback.filter(f => Number(f.rating) >= 4).length;
  const negativeCount = starByRating != null
    ? (starByRating[1] ?? 0) + (starByRating[2] ?? 0) + (starByRating[3] ?? 0)
    : feedback.filter(f => Number(f.rating) <= 3).length;
  const starTotal = starByRating != null
    ? [1, 2, 3, 4, 5].reduce((s, r) => s + (starByRating[r] ?? 0), 0)
    : 0;
  const averageRating = starByRating != null && starTotal > 0
    ? [1, 2, 3, 4, 5].reduce((s, r) => s + r * (starByRating[r] ?? 0), 0) / starTotal
    : totalFeedback > 0
      ? (feedback.reduce((sum, f) => sum + Number(f.rating), 0) / totalFeedback)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayItems = tableType === 'feedback' ? filteredFeedback : tableType === 'suggestions' ? filteredSuggestions : filteredOptIns;
  const visibleItems = displayItems.slice(0, visibleCount);
  const hasMore = visibleCount < displayItems.length;

  return (
    <div className="space-y-6">
      {/* View Tabs & Time Range Selectors */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-center border-b border-slate-200">
          {(Object.keys(TABLE_TYPE_LABELS) as TableType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTableType(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tableType === t
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {TABLE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {tableType === 'feedback' && (
          <>
            <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
              <label htmlFor="time-range" className="text-sm font-medium text-slate-700">Time range:</label>
              <select
                id="time-range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 sm:flex-initial"
              >
                {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((range) => (
                  <option key={range} value={range}>{TIME_RANGE_LABELS[range]}</option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
              <label htmlFor="feedback-location" className="text-sm font-medium text-slate-700">Location:</label>
              <select
                id="feedback-location"
                value={feedbackLocation}
                onChange={(e) => setFeedbackLocation(e.target.value)}
                className="w-full min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 sm:flex-initial"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Stats Grid - Feedback only */}
      {tableType === 'feedback' && (
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
      )}

      {/* Analytics Section - Feedback only */}
      {tableType === 'feedback' && analytics && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Funnel */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Feedback</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Page views</span>
                  <span className="font-semibold">{analytics.funnel.page_views}</span>
                </div>
                {([1, 2, 3, 4, 5] as const).map((r) => {
                  const count = analytics.funnel.star_clicks_by_rating?.[r] ?? 0;
                  const starTotal = [1, 2, 3, 4, 5].reduce((s, i) => s + (analytics.funnel.star_clicks_by_rating?.[i] ?? 0), 0);
                  const percentage = starTotal > 0 ? (count / starTotal) * 100 : 0;
                  return (
                    <div key={r} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-10">
                        <span className="text-sm font-medium text-slate-700">{r}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden min-w-[4rem]">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-slate-600">Submissions</span>
                  <span className="font-semibold">{analytics.funnel.submissions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Opt-ins</span>
                  <span className="font-semibold">{analytics.funnel.opt_ins_count ?? 0}</span>
                </div>
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
          <h2 className="text-2xl text-black">
            {tableType === 'feedback' && feedbackLocation
              ? (locations.find((l) => l.id === feedbackLocation)?.name ?? 'Feedback')
              : TABLE_TYPE_LABELS[tableType]}
          </h2>
          <p className="text-gray-600 mt-1">{displayItems.length} items</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg transition-colors ${
              showFilters ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
            title={`Filter ${TABLE_TYPE_LABELS[tableType]}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          {displayItems.length > 0 && (
            <button
              onClick={exportToCSV}
              className="p-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          {tableType === 'feedback' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">All Countries</option>
                {Array.from(new Set(feedback.map(f => f.country).filter(Boolean) as string[])).sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {tableType === 'suggestions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  placeholder="Search suggestions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <select
                value={suggestionLocation}
                onChange={(e) => setSuggestionLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Locations ({suggestions.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({suggestions.filter(s => s.locationId === loc.id).length})</option>
                ))}
              </select>
            </div>
          )}
          {tableType === 'opt-ins' && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <label htmlFor="optin-location" className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Location:</label>
              <select
                id="optin-location"
                value={optInLocation}
                onChange={(e) => setOptInLocation(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Locations ({optIns.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({optIns.filter(o => o.locationId === loc.id).length})</option>
                ))}
              </select>
            </div>
          )}

          {/* Active Filters */}
          {tableType === 'feedback' && (searchTerm || filterRating !== null || filterDevice || filterCountry) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && <button onClick={() => setSearchTerm('')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Search: {searchTerm} <X className="w-3 h-3" /></button>}
              {filterRating !== null && <button onClick={() => setFilterRating(null)} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">{filterRating} Stars <X className="w-3 h-3" /></button>}
              {filterDevice && <button onClick={() => setFilterDevice('')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Device: {filterDevice} <X className="w-3 h-3" /></button>}
              {filterCountry && <button onClick={() => setFilterCountry('')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Country: {filterCountry} <X className="w-3 h-3" /></button>}
            </div>
          )}
          {tableType === 'suggestions' && (suggestionSearch || suggestionLocation !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {suggestionSearch && <button onClick={() => setSuggestionSearch('')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Search: {suggestionSearch} <X className="w-3 h-3" /></button>}
              {suggestionLocation !== 'all' && <button onClick={() => setSuggestionLocation('all')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">{locations.find(l => l.id === suggestionLocation)?.name} <X className="w-3 h-3" /></button>}
            </div>
          )}
          {tableType === 'opt-ins' && optInLocation !== 'all' && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filter:</span>
              <button onClick={() => setOptInLocation('all')} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">{locations.find(l => l.id === optInLocation)?.name} <X className="w-3 h-3" /></button>
            </div>
          )}
        </div>
      )}

      {/* Data Table */}
      <div data-tour="recent-feedback">
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-600">
              {tableType === 'feedback' && 'No feedback found'}
              {tableType === 'suggestions' && 'No suggestions yet'}
              {tableType === 'opt-ins' && 'No opt-ins yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {tableType === 'feedback' && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Rating</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Comment / Sentiment</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                        </>
                      )}
                      {tableType === 'suggestions' && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Suggestion</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                        </>
                      )}
                      {tableType === 'opt-ins' && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Customer</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tableType === 'feedback' && (visibleItems as Feedback[]).map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
                        onClick={() => setDetailId(item.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.comment ? (
                            <p className="text-slate-700 line-clamp-2">{item.comment}</p>
                          ) : (
                            <span className={item.rating >= 4 ? 'text-green-600' : 'text-amber-600'}>{getSentimentLabel(item.rating)}</span>
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
                    {tableType === 'suggestions' && (visibleItems as Suggestion[]).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0" onClick={() => setDetailId(s.id)}>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-700 line-clamp-2">{s.content}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span>{s.submitterEmail || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{s.locationName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(s.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tableType === 'opt-ins' && (visibleItems as OptIn[]).map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0" onClick={() => setDetailId(o.id)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-900">{o.name || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span>{o.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{locations.find(l => l.id === o.locationId)?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(o.createdAt)}</span>
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
              {tableType === 'feedback' && (visibleItems as Feedback[]).map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setDetailId(item.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setDetailId(item.id)}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex flex-shrink-0 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.comment ? <p className="text-slate-700 line-clamp-2">{item.comment}</p> : (
                        <span className={item.rating >= 4 ? 'text-green-600 text-sm font-medium' : 'text-amber-600 text-sm font-medium'}>{getSentimentLabel(item.rating)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />{formatRelative(item.createdAt)}</span>
                    {item.locationName && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />{item.locationName}</span>}
                    {item.deviceType && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{item.deviceType}</span>}
                    {(item.country || item.region) && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{[item.region, item.country].filter(Boolean).join(', ')}</span>}
                  </div>
                </div>
              ))}
              {tableType === 'suggestions' && (visibleItems as Suggestion[]).map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setDetailId(s.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setDetailId(s.id)}>
                  <div className="flex items-start gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 flex-1">{s.content}</p>
                  </div>
                  {s.submitterEmail && <div className="flex items-center gap-2 text-slate-600 mb-2 text-sm"><Mail className="w-4 h-4 flex-shrink-0" /><span className="truncate">{s.submitterEmail}</span></div>}
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-2"><Calendar className="w-4 h-4 flex-shrink-0" />{formatDate(s.createdAt)}</div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm"><MapPin className="w-4 h-4 flex-shrink-0" />{s.locationName || 'N/A'}</div>
                </div>
              ))}
              {tableType === 'opt-ins' && (visibleItems as OptIn[]).map((o) => (
                <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setDetailId(o.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setDetailId(o.id)}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{o.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-600 truncate">{o.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm"><Calendar className="w-4 h-4 flex-shrink-0" />{formatDate(o.createdAt)}</div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm mt-1"><MapPin className="w-4 h-4 flex-shrink-0" />{locations.find(l => l.id === o.locationId)?.name || 'N/A'}</div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setVisibleCount((v) => v + 6)}
                  className="px-6 py-3 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Load more
                </button>
              </div>
            )}

            {/* Detail Modal */}
            {detailId && (() => {
              if (tableType === 'feedback') {
                const item = filteredFeedback.find((f) => f.id === detailId);
                if (!item) return null;
                return (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailId(null)} role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6">
                        <h3 id="feedback-detail-title" className="sr-only">Feedback details</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-5 h-5 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className={item.rating >= 4 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>{getSentimentLabel(item.rating)}</span>
                        </div>
                        {item.comment ? <p className="text-slate-900 mb-4 whitespace-pre-wrap">{item.comment}</p> : <p className="text-slate-500 mb-4 italic">No comment provided</p>}
                        <div className="text-sm text-slate-600 space-y-2 mb-6">
                          {(item.name || item.email) && <div className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" />{item.name && <span>{item.name}</span>}{item.email && <span>{item.email}</span>}</div>}
                          {item.locationName && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" />{item.locationName}</div>}
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" />{new Date(item.createdAt).toLocaleString()}</div>
                          {(item.deviceType || item.country || item.region) && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {item.deviceType && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{item.deviceType}</span>}
                              {(item.country || item.region) && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{[item.region, item.country].filter(Boolean).join(', ')}</span>}
                            </div>
                          )}
                        </div>
                        <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50" onClick={() => setDetailId(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                );
              }
              if (tableType === 'suggestions') {
                const item = suggestions.find((s) => s.id === detailId);
                if (!item) return null;
                return (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !deleting && setDetailId(null)} role="dialog" aria-modal="true" aria-labelledby="suggestion-detail-title">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6">
                        <h3 id="suggestion-detail-title" className="sr-only">Suggestion details</h3>
                        <p className="text-slate-900 mb-4 whitespace-pre-wrap">{item.content}</p>
                        <div className="text-sm text-slate-600 space-y-2 mb-6">
                          {item.submitterEmail && <div className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" />{item.submitterEmail}</div>}
                          {item.locationName && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" />{item.locationName}</div>}
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" />{formatDate(item.createdAt)}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50" onClick={() => setDetailId(null)} disabled={deleting}>Close</button>
                          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50" onClick={() => handleDeleteSuggestion(item.id)} disabled={deleting}><Trash2 className="w-4 h-4" />{deleting ? 'Deleting...' : 'Delete'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              const item = optIns.find((o) => o.id === detailId);
              if (!item) return null;
              const locName = locations.find((l) => l.id === item.locationId)?.name || 'N/A';
              return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !deleting && setDetailId(null)} role="dialog" aria-modal="true" aria-labelledby="optin-detail-title">
                  <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6">
                      <h3 id="optin-detail-title" className="sr-only">Opt-in details</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-blue-600" /></div>
                        <div>
                          <div className="font-semibold text-slate-900 text-lg">{item.name || 'Anonymous'}</div>
                          <div className="text-sm text-slate-600">{item.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 space-y-2 mb-6">
                        {item.phone && <div className="flex items-center gap-2"><span className="font-medium">Phone:</span>{item.phone}</div>}
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" />{locName}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" />{formatDate(item.createdAt)}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50" onClick={() => setDetailId(null)} disabled={deleting}>Close</button>
                        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50" onClick={() => handleDeleteOptIn(item.id)} disabled={deleting}><Trash2 className="w-4 h-4" />{deleting ? 'Deleting...' : 'Delete'}</button>
                      </div>
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