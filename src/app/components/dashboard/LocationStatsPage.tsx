import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Star, TrendingUp, MessageSquare, Download, ExternalLink, Edit2, Copy, Check } from 'lucide-react';
import { api } from '../../api/client';

interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  reviewPlatforms: Array<{ name: string; url: string }>;
  createdAt: string;
}

interface Feedback {
  id: string;
  locationId?: string;
  businessId?: string;
  rating: number;
  comment: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
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

export function LocationStatsPage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [copiedFor, setCopiedFor] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  useEffect(() => {
    loadLocationData();
  }, [locationId, timeRange]);

  const loadLocationData = async () => {
    if (!locationId) return;

    try {
      // Load location details
      const locations = await api.getLocations();
      const loc = locations.find(l => l.id === locationId);
      
      if (!loc) {
        alert('Location not found');
        navigate('/dashboard');
        return;
      }

      setLocation(loc);

      const since = timeRange === 'all' ? undefined : timeRange;
      const locationFeedback = await api.getFeedback(locationId, since, locationId);
      setFeedback(locationFeedback);
    } catch (error) {
      console.error('Failed to load location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalFeedback = feedback.length;
    const r = (f: Feedback) => Number(f.rating);
    const positiveFeedback = feedback.filter(f => r(f) >= 4).length;
    const negativeFeedback = feedback.filter(f => r(f) <= 3).length;
    const averageRating = totalFeedback > 0
      ? feedback.reduce((acc, f) => acc + r(f), 0) / totalFeedback
      : 0;

    const ratingDistribution = {
      5: feedback.filter(f => r(f) === 5).length,
      4: feedback.filter(f => r(f) === 4).length,
      3: feedback.filter(f => r(f) === 3).length,
      2: feedback.filter(f => r(f) === 2).length,
      1: feedback.filter(f => r(f) === 1).length,
    };

    return {
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
      averageRating,
      ratingDistribution,
    };
  };

  const exportCSV = () => {
    if (!location) return;

    const headers = ['Date', 'Rating', 'Name', 'Email', 'Phone', 'Comment'];
    const rows = feedback.map(f => [
      new Date(f.createdAt).toLocaleDateString(),
      f.rating,
      f.name || 'Anonymous',
      f.email || '',
      f.phone || '',
      (f.comment || '').replace(/"/g, '""'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${location.name.replace(/\s+/g, '_')}_feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  type PageType = 'feedback' | 'suggestions' | 'opt-in';

  const getPagePath = (locId: string, pageType: PageType) => {
    const base = `/l/${locId}`;
    if (pageType === 'feedback') return base;
    if (pageType === 'suggestions') return `${base}/suggestions`;
    return `${base}/opt-in`;
  };

  const copyPageUrl = (locId: string, pageType: PageType, e: React.MouseEvent) => {
    const url = `${window.location.origin}${getPagePath(locId, pageType)}`;
    navigator.clipboard.writeText(url);
    setCopiedFor(pageType);
    setTimeout(() => setCopiedFor(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  const stats = calculateStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Locations</span>
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              {location.logoUrl ? (
                <img
                  src={location.logoUrl}
                  alt={location.name}
                  className="h-12 w-12 object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{location.name}</h1>
            <p className="text-slate-600 mt-1">{location.address}</p>
            {(location.phone || location.email) && (
              <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-slate-600">
                {location.phone && <span>📞 {location.phone}</span>}
                {location.email && <span>✉️ {location.email}</span>}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="time-range" className="text-sm font-medium text-slate-700">Time range:</label>
              <select
                id="time-range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900"
              >
                {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((range) => (
                  <option key={range} value={range}>{TIME_RANGE_LABELS[range]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="p-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export CSV"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/dashboard/locations/edit/${locationId}`)}
              className="p-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Edit Location"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copy & View - 3 rows */}
      <div className="bg-white rounded-xl border border-slate-200 p-6" data-tour="feedback-link">
        <p className="text-xs font-medium text-slate-700 mb-2">Feedback Page:</p>
        <div className="flex items-center gap-2 mb-4" data-tour="qr-code">
          <button
            onClick={(e) => copyPageUrl(locationId!, 'feedback', e)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {copiedFor === 'feedback' ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          <a
            href={getPagePath(locationId!, 'feedback')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Page
          </a>
        </div>
        <p className="text-xs font-medium text-slate-700 mb-2">Suggestion Page:</p>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={(e) => copyPageUrl(locationId!, 'suggestions', e)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {copiedFor === 'suggestions' ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          <a
            href={getPagePath(locationId!, 'suggestions')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Page
          </a>
        </div>
        <p className="text-xs font-medium text-slate-700 mb-2">Opt-In Page:</p>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => copyPageUrl(locationId!, 'opt-in', e)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {copiedFor === 'opt-in' ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          <a
            href={getPagePath(locationId!, 'opt-in')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Page
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600">Total Feedback</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalFeedback}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600">Positive (4-5★)</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.positiveFeedback}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600">Negative (1-3★)</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.negativeFeedback}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600">Average Rating</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            {typeof stats.averageRating === 'number' && !isNaN(stats.averageRating)
              ? stats.averageRating.toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Feedback</h2>
        
        {feedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No feedback received yet for this location</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.slice(0, 10).map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {item.name || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 text-sm">{item.comment}</p>
                {(item.email || item.phone) && (
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                    {item.email && <span>✉️ {item.email}</span>}
                    {item.phone && <span>📞 {item.phone}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = stats.totalFeedback > 0 ? (count / stats.totalFeedback) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-slate-700">{rating}</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 w-20 text-right">
                  {count} ({typeof percentage === 'number' && !isNaN(percentage)
                    ? percentage.toFixed(0)
                    : 0}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Platforms */}
      {location.reviewPlatforms.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Review Platforms</h2>
          <div className="flex flex-wrap gap-3">
            {location.reviewPlatforms.map((platform, idx) => (
              <a
                key={idx}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                {platform.name}
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}