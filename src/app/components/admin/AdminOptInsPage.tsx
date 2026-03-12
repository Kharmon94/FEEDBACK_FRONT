import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MapPin, User, Download, Mail, Calendar, Gift, Phone } from 'lucide-react';
import { api, downloadBlob, type AdminOptIn } from '../../../services/api';

export function AdminOptInsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationIdFromUrl = searchParams.get('location_id') ?? '';
  const userIdFromUrl = searchParams.get('user_id') ?? '';

  const [optIns, setOptIns] = useState<AdminOptIn[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_count: 0, per_page: 50 });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<AdminOptIn | null>(null);

  const loadOptIns = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await api.getAdminOptIns({
        page,
        per_page: 50,
        location_id: locationIdFromUrl || undefined,
        user_id: userIdFromUrl || undefined,
      });
      setOptIns(data.opt_ins);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading opt-ins:', error);
    } finally {
      setLoading(false);
    }
  }, [locationIdFromUrl, userIdFromUrl]);

  useEffect(() => {
    loadOptIns(1);
  }, [loadOptIns]);

  useEffect(() => {
    if (!detailId) {
      setDetailItem(null);
      return;
    }
    api.getAdminOptIn(detailId).then(setDetailItem).catch(() => setDetailItem(null));
  }, [detailId]);

  const exportOptIns = async () => {
    setExporting(true);
    try {
      const blob = await api.exportAdminOptIns({
        location_id: locationIdFromUrl || undefined,
        user_id: userIdFromUrl || undefined,
      });
      downloadBlob(blob, `opt-ins-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Ensure you are signed in as an admin.');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading opt-ins...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Opt-Ins</h2>
          <p className="text-slate-600">{pagination.total_count} total</p>
        </div>
        <button
          onClick={exportOptIns}
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
        {optIns.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No opt-ins found.</div>
        ) : (
          optIns.map((o) => (
            <div
              key={o.id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setDetailId(o.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{o.name || 'Anonymous'}</div>
                  <div className="text-sm text-slate-600">{o.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pl-12">
                {o.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {o.phone}
                  </span>
                )}
                {o.location_name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {o.location_name}
                  </span>
                )}
                {o.user_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {o.user_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {o.created_at ? formatDate(o.created_at) : '—'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <span className="text-sm text-slate-600">
            Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={() => loadOptIns(pagination.current_page - 1)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={() => loadOptIns(pagination.current_page + 1)}
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-lg">{detailItem.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-600">{detailItem.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 space-y-2">
                    {detailItem.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {detailItem.phone}
                      </div>
                    )}
                    {detailItem.rating != null && (
                      <div className="flex items-center gap-1">
                        <span>Rating:</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < detailItem.rating! ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
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
                      {detailItem.created_at ? formatDate(detailItem.created_at) : '—'}
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
