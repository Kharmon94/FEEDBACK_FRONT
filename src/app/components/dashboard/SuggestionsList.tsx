import { useState, useEffect } from 'react';
import { Lightbulb, Mail, Calendar, MessageSquare, Download, MapPin, Filter, X, Search, Trash2 } from 'lucide-react';
import { api } from '../../api/client';

interface Suggestion {
  id: string;
  content: string;
  submitterEmail: string | null;
  locationId: string | null;
  createdAt: string;
  locationName?: string;
}

interface Location {
  id: string;
  name: string;
}

export function SuggestionsList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [locsData, suggestionsData] = await Promise.all([
          api.getLocations(),
          api.getSuggestions(),
        ]);
        if (!cancelled) {
          setLocations(locsData);
          setSuggestions(suggestionsData);
        }
      } catch (e) {
        if (!cancelled) {
          setLocations([]);
          setSuggestions([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this suggestion? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteSuggestion(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setDetailId(null);
    } catch (e) {
      console.error('Failed to delete suggestion:', e);
      alert('Failed to delete suggestion. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const filteredSuggestions = suggestions.filter((s) => {
    const matchLocation = selectedLocation === 'all' || s.locationId === selectedLocation;
    const matchSearch =
      !searchTerm ||
      s.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.submitterEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLocation && matchSearch;
  });

  const exportToCSV = () => {
    const dataToExport =
      selectedLocation === 'all'
        ? filteredSuggestions
        : filteredSuggestions.filter((s) => s.locationId === selectedLocation);

    const headers = ['Content', 'Email', 'Date', 'Location'];
    const rows = dataToExport.map((s) => [
      (s.content || '').replace(/"/g, '""'),
      s.submitterEmail || '',
      formatDate(s.createdAt),
      s.locationName || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `suggestions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Icons */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl text-black">Suggestions</h2>
          <p className="text-gray-600 mt-1">{filteredSuggestions.length} items</p>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {locations.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
              }`}
              title="Filter Suggestions"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
          {filteredSuggestions.length > 0 && (
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
      {showFilters && locations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search suggestions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Location
              </label>
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Locations ({suggestions.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({suggestions.filter((s) => s.locationId === loc.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || selectedLocation !== 'all') && (
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
              {selectedLocation !== 'all' && (
                <button
                  onClick={() => setSelectedLocation('all')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  {locations.find((l) => l.id === selectedLocation)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {filteredSuggestions.length === 0 && suggestions.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
          <Lightbulb className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
            No suggestions match your filters
          </h3>
          <p className="text-sm sm:text-base text-slate-600">
            Try adjusting the search or location filter above.
          </p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
          <Lightbulb className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No suggestions yet</h3>
          <p className="text-sm sm:text-base text-slate-600">
            When customers share ideas via the suggestion page, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Suggestion</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSuggestions.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setDetailId(s.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700 line-clamp-3">{s.content}</p>
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
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(s.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{s.locationName || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredSuggestions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setDetailId(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setDetailId(s.id)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700 flex-1">{s.content}</p>
                </div>
                {s.submitterEmail && (
                  <div className="flex items-center gap-2 text-slate-600 mb-2 text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{s.submitterEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{formatDate(s.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{s.locationName || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail modal */}
      {detailId != null && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setDetailId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggestion-detail-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = suggestions.find((s) => s.id === detailId);
              if (!item) {
                return (
                  <div className="p-6">
                    <p className="text-slate-500">Suggestion not found.</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                      onClick={() => setDetailId(null)}
                    >
                      Close
                    </button>
                  </div>
                );
              }
              return (
                <div className="p-6">
                  <h3 id="suggestion-detail-title" className="sr-only">
                    Suggestion details
                  </h3>
                  <p className="text-slate-900 mb-4 whitespace-pre-wrap">{item.content}</p>
                  <div className="text-sm text-slate-600 space-y-2 mb-6">
                    {item.submitterEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        {item.submitterEmail}
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
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                      onClick={() => setDetailId(null)}
                      disabled={deleting}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
