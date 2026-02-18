import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MapPin, User, Download, Mail, Calendar } from 'lucide-react';
import { api, downloadBlob, type AdminSuggestion } from '../../../services/api';

export function AdminSuggestionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationIdFromUrl = searchParams.get('location_id') ?? '';
  const userIdFromUrl = searchParams.get('user_id') ?? '';

  const [suggestions, setSuggestions] = useState<AdminSuggestion[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_count: 0, per_page: 50 });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminSuggestion | null>(null);

  const loadSuggestions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await api.getAdminSuggestions({
        page,
        per_page: 50,
        location_id: locationIdFromUrl || undefined,
        user_id: userIdFromUrl || undefined,
      });
      setSuggestions(data.suggestions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [locationIdFromUrl, userIdFromUrl]);

  useEffect(() => {
    loadSuggestions(1);
  }, [loadSuggestions]);

  useEffect(() => {
    if (!detailId) {
      setDetailItem(null);
      return;
    }
    api.getAdminSuggestion(detailId).then(setDetailItem).catch(() => setDetailItem(null));
  }, [detailId]);

  const exportSuggestions = async () => {
    setExporting(true);
    try {
      const blob = await api.exportAdminSuggestions();
      downloadBlob(blob, `suggestions-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Ensure you are signed in as an admin.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Suggestions</h2>
          <p className="text-slate-600">{pagination.total_count} total</p>
        </div>
        <button
          onClick={exportSuggestions}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {(locationIdFromUrl || userIdFromUrl) && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">
            {locationIdFromUrl && <>Location: {locationIdFromUrl}</>}
            {locationIdFromUrl && userIdFromUrl && ' • '}
            {userIdFromUrl && <>User: {userIdFromUrl}</>}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
        {suggestions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No suggestions found.</div>
        ) : (
          suggestions.map((s) => (
            <div
              key={s.id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setDetailId(s.id)}
            >
              <p className="text-slate-900 mb-3">{s.content}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {s.submitter_email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {s.submitter_email}
                  </span>
                )}
                {s.location_name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {s.location_name}
                  </span>
                )}
                {s.user_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {s.user_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                </span>
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
              onClick={() => loadSuggestions(pagination.current_page - 1)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={() => loadSuggestions(pagination.current_page + 1)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {detailId != null && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDetailId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {detailItem ? (
                <div className="space-y-4">
                  <p className="text-slate-900">{detailItem.content}</p>
                  <div className="text-sm text-slate-600 space-y-2">
                    {detailItem.submitter_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {detailItem.submitter_email}
                      </div>
                    )}
                    {detailItem.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {detailItem.location_name}
                        {detailItem.location_id && (
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => navigate(`/admin/locations/${detailItem.location_id}`)}
                          >
                            View location
                          </button>
                        )}
                      </div>
                    )}
                    {detailItem.user_name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {detailItem.user_name} ({detailItem.user_email})
                        {detailItem.user_id && (
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => navigate(`/admin/users/${detailItem.user_id}`)}
                          >
                            View user
                          </button>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {detailItem.created_at ? new Date(detailItem.created_at).toLocaleString() : '—'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">Loading...</div>
              )}
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                onClick={() => setDetailId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
