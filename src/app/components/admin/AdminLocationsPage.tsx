import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Search,
  MapPin,
  MessageSquare,
  Star,
  ExternalLink,
  Download,
  MapPinPlus
} from 'lucide-react';
import { api, downloadBlob, type AdminLocation, type AdminUser } from '../../../services/api';

export function AdminLocationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('user_id') ?? '';

  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_count: 0, per_page: 50 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [createLocationForm, setCreateLocationForm] = useState({ user_id: '', name: '' });
  const [createLocationError, setCreateLocationError] = useState<string | null>(null);
  const [creatingLocation, setCreatingLocation] = useState(false);
  const [usersForSelect, setUsersForSelect] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadLocations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await api.getAdminLocations({
        page,
        per_page: 50,
        search: searchQuery || undefined,
        user_id: userIdFromUrl || undefined,
      });
      setLocations(data.locations);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, userIdFromUrl]);

  useEffect(() => {
    loadLocations(1);
  }, [loadLocations]);

  const getRatingColor = (rating: number | null) => {
    if (rating == null) return 'text-slate-500';
    if (rating >= 4.5) return 'text-green-700';
    if (rating >= 3.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  const handleSearch = () => loadLocations(1);

  const exportLocations = async () => {
    setExporting(true);
    try {
      const blob = await api.exportAdminLocations();
      downloadBlob(blob, `locations-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Ensure you are signed in as an admin.');
    } finally {
      setExporting(false);
    }
  };

  const openCreateLocation = async () => {
    setShowCreateLocation(true);
    setCreateLocationError(null);
    setCreateLocationForm({ user_id: '', name: '' });
    if (usersForSelect.length === 0) {
      setLoadingUsers(true);
      try {
        const data = await api.getAdminUsers({ per_page: 500 });
        setUsersForSelect(data.users);
        if (data.users.length > 0) {
          setCreateLocationForm((f) => ({ ...f, user_id: data.users[0].id }));
        }
      } catch (e) {
        console.error('Failed to load users:', e);
        setCreateLocationError('Could not load users.');
      } finally {
        setLoadingUsers(false);
      }
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLocationError(null);
    if (!createLocationForm.user_id || !createLocationForm.name.trim()) {
      setCreateLocationError('Select a user and enter a location name.');
      return;
    }
    setCreatingLocation(true);
    try {
      await api.createAdminLocation({
        user_id: createLocationForm.user_id,
        name: createLocationForm.name.trim(),
      });
      setShowCreateLocation(false);
      setCreateLocationForm({ user_id: '', name: '' });
      loadLocations(1);
    } catch (err: unknown) {
      setCreateLocationError(err instanceof Error ? err.message : 'Failed to create location.');
    } finally {
      setCreatingLocation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading locations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Locations</h2>
          <p className="text-slate-600">{pagination.total_count} total locations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreateLocation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <MapPinPlus className="w-4 h-4" />
            Create location
          </button>
          <button
            onClick={exportLocations}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {showCreateLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !creatingLocation && setShowCreateLocation(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create location</h3>
            <form onSubmit={handleCreateLocation} className="space-y-4">
              {createLocationError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{createLocationError}</div>
              )}
              {loadingUsers ? (
                <div className="text-slate-500 text-sm">Loading users...</div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner (user) *</label>
                    <select
                      value={createLocationForm.user_id}
                      onChange={(e) => setCreateLocationForm((f) => ({ ...f, user_id: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select user</option>
                      {usersForSelect.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name ?? u.email} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location name *</label>
                    <input
                      type="text"
                      required
                      value={createLocationForm.name}
                      onChange={(e) => setCreateLocationForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="e.g. Downtown Branch"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateLocation(false)}
                      disabled={creatingLocation}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingLocation || usersForSelect.length === 0}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      {creatingLocation ? 'Creating...' : 'Create location'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location name, user name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Search
          </button>
        </div>
        {userIdFromUrl && (
          <p className="text-sm text-slate-600 mt-2">Filtered by user ID: {userIdFromUrl}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No locations found
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr
                    key={loc.id}
                    onClick={() => navigate(`/admin/locations/${loc.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{loc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{loc.user_name ?? '—'}</div>
                        <div className="text-sm text-slate-500">{loc.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-900">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        {Number(loc.feedback_count ?? 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 text-sm font-medium ${getRatingColor(loc.avg_rating)}`}>
                        <Star className="w-4 h-4 fill-current" />
                        {loc.avg_rating != null ? Number(loc.avg_rating).toFixed(1) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {loc.created_at ? new Date(loc.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/locations/${loc.id}`);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-sm text-slate-600">
              Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.current_page <= 1}
                onClick={() => loadLocations(pagination.current_page - 1)}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.current_page >= pagination.total_pages}
                onClick={() => loadLocations(pagination.current_page + 1)}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
