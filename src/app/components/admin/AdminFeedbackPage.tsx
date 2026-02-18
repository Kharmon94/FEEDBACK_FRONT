import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import {
  Search,
  Filter,
  Star,
  MapPin,
  User,
  Download,
  Eye,
  X
} from 'lucide-react';
import { api, downloadBlob, type AdminFeedbackItem } from '../../../services/api';

export function AdminFeedbackPage() {
  const [searchParams] = useSearchParams();
  const locationIdFromUrl = searchParams.get('location_id') ?? '';
  const userIdFromUrl = searchParams.get('user_id') ?? '';

  const [feedback, setFeedback] = useState<AdminFeedbackItem[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_count: 0, per_page: 50 });
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminFeedbackItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadFeedback = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const ratingNum = filterRating !== 'all' && filterRating !== 'positive' && filterRating !== 'negative'
        ? parseInt(filterRating, 10)
        : undefined;
      const data = await api.getAdminFeedback({
        page,
        per_page: 50,
        location_id: locationIdFromUrl || undefined,
        user_id: userIdFromUrl || undefined,
        rating: ratingNum,
      });
      setFeedback(data.feedback);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [locationIdFromUrl, userIdFromUrl, filterRating]);

  useEffect(() => {
    loadFeedback(1);
  }, [loadFeedback]);

  useEffect(() => {
    if (!detailId) {
      setDetailItem(null);
      return;
    }
    setDetailLoading(true);
    api.getAdminFeedbackItem(detailId)
      .then(setDetailItem)
      .catch(() => setDetailItem(null))
      .finally(() => setDetailLoading(false));
  }, [detailId]);

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-700';
    if (rating === 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const exportFeedback = async () => {
    setExporting(true);
    try {
      const blob = await api.exportAdminFeedback();
      downloadBlob(blob, `feedback-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Ensure you are signed in as an admin.');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Feedback Management</h2>
          <p className="text-slate-600">{pagination.total_count} total submissions</p>
        </div>
        <button
          onClick={exportFeedback}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {(locationIdFromUrl || userIdFromUrl) && (
            <p className="text-sm text-slate-600">
              {locationIdFromUrl && <>Location: {locationIdFromUrl}</>}
              {locationIdFromUrl && userIdFromUrl && ' • '}
              {userIdFromUrl && <>User: {userIdFromUrl}</>}
            </p>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {filterRating !== 'all' && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No feedback found
          </div>
        ) : (
          feedback.map((item) => (
            <div
              key={item.id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setDetailId(item.id)}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${getRatingColor(item.rating)}`}>
                    {item.rating}
                  </span>
                  <div className="flex items-center gap-1">
                    {getRatingStars(item.rating)}
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {formatDate(item.created_at)}
                </div>
              </div>

              <p className="text-slate-900 mb-4">{item.comment ?? '—'}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{item.location_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{item.user_name ?? item.user_email}</span>
                </div>
                {item.customer_name && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">From:</span>
                    <span>{item.customer_name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailId(item.id);
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
                >
                  <Eye className="w-4 h-4" />
                  View detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <span className="text-sm text-slate-600">
            Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={() => loadFeedback(pagination.current_page - 1)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={() => loadFeedback(pagination.current_page + 1)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailId != null && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDetailId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Feedback detail</h3>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {detailLoading ? (
                <div className="text-slate-500">Loading...</div>
              ) : detailItem ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${getRatingColor(detailItem.rating)}`}>
                      {detailItem.rating}
                    </span>
                    {getRatingStars(detailItem.rating)}
                    <span className="text-sm text-slate-500 ml-2">{formatDate(detailItem.created_at)}</span>
                  </div>
                  <p className="text-slate-900">{detailItem.comment ?? '—'}</p>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {detailItem.location_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {detailItem.user_name ?? detailItem.user_email} ({detailItem.user_email})
                    </div>
                    {detailItem.customer_name && (
                      <div>From: {detailItem.customer_name}{detailItem.customer_email ? ` (${detailItem.customer_email})` : ''}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">Could not load detail.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
