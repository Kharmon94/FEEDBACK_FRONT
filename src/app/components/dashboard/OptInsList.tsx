import { useState, useEffect } from 'react';
import { Gift, Mail, Calendar, User, Download, MapPin, Filter, X } from 'lucide-react';
import { api } from '../../api/client';

interface OptIn {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  rating?: number;
  locationId?: string;
}

interface Location {
  id: string;
  name: string;
}

export function OptInsList() {
  const [optIns, setOptIns] = useState<OptIn[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [locsData, optInsData] = await Promise.all([
          api.getLocations(),
          api.getOptIns(), // Load all opt-ins for user's locations
        ]);
        if (!cancelled) {
          setLocations(locsData);
          setOptIns(optInsData);
        }
      } catch (e) {
        if (!cancelled) {
          setLocations([]);
          setOptIns([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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

  const exportToCSV = () => {
    // Filter data based on selected location before export
    const dataToExport = selectedLocation === 'all' 
      ? optIns 
      : optIns.filter(optIn => optIn.locationId === selectedLocation);

    // Create CSV content
    const headers = ['Name', 'Email', 'Rating', 'Date', 'Location'];
    const rows = dataToExport.map(optIn => [
      optIn.name || 'Anonymous',
      optIn.email,
      optIn.rating || 'N/A',
      formatDate(optIn.createdAt),
      locations.find(loc => loc.id === optIn.locationId)?.name || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `opt-ins-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter opt-ins based on selected location
  const filteredOptIns = selectedLocation === 'all' 
    ? optIns 
    : optIns.filter(optIn => optIn.locationId === selectedLocation);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading opt-ins...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Icons */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl text-black">Rewards Opt-Ins</h2>
          <p className="text-gray-600 mt-1">{filteredOptIns.length} customers</p>
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
              title="Filter Opt-Ins"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
          {filteredOptIns.length > 0 && (
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

      {/* Collapsible Location Filter */}
      {showFilters && locations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <label htmlFor="location-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by Location:
            </label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="all">All Locations ({optIns.length})</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} ({optIns.filter(opt => opt.locationId === location.id).length})
                </option>
              ))}
            </select>
          </div>
          
          {/* Active Filter */}
          {selectedLocation !== 'all' && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filter:</span>
              <button
                onClick={() => setSelectedLocation('all')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                {locations.find(loc => loc.id === selectedLocation)?.name}
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {filteredOptIns.length === 0 && optIns.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
          <MapPin className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No opt-ins for this location</h3>
          <p className="text-sm sm:text-base text-slate-600">
            Try selecting a different location from the filter above.
          </p>
        </div>
      ) : filteredOptIns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
          <Gift className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No opt-ins yet</h3>
          <p className="text-sm sm:text-base text-slate-600">
            When customers opt in to receive rewards, they'll appear here.
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
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Rating
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredOptIns.map((optIn) => (
                    <tr key={optIn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {optIn.name || 'Anonymous'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{optIn.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(optIn.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {optIn.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < optIn.rating!
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
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
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{locations.find(loc => loc.id === optIn.locationId)?.name || 'N/A'}</span>
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
            {filteredOptIns.map((optIn) => (
              <div key={optIn.id} className="bg-white rounded-xl border border-slate-200 p-4">
                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-base truncate">
                      {optIn.name || 'Anonymous'}
                    </div>
                    {optIn.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < optIn.rating!
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
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
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-slate-600 mb-2 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{optIn.email}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{formatDate(optIn.createdAt)}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{locations.find(loc => loc.id === optIn.locationId)?.name || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}