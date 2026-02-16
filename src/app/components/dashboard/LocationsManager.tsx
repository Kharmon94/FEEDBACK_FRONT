import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, ExternalLink, Copy, Check, ChevronRight, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { api } from '../../api/client';

interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  reviewPlatforms: Array<{ name: string; url: string; customName?: string }>;
  createdAt: string;
}

export function LocationsManager() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Current plan info - this could be fetched from the server in the future
  // For now, we'll use a hardcoded plan (Starter = 1, Pro = 5, Business = 15, Enterprise = unlimited)
  const [currentPlan] = useState({
    id: 'starter',
    name: 'Starter',
    locationLimit: 1
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await api.getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyFeedbackUrl = (locationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when copying URL
    
    const url = `${window.location.origin}/l/${locationId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(locationId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (locationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to stats when clicking edit
    navigate(`/dashboard/locations/edit/${locationId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user has reached their location limit
  const hasReachedLimit = locations.length >= currentPlan.locationLimit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl text-slate-900">Locations</h2>
          <p className="text-slate-600 mt-1">Manage your business locations and feedback pages</p>
        </div>
        
        {hasReachedLimit ? (
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard?tab=billing')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowUpCircle className="w-5 h-5" />
              Upgrade Plan
            </button>
            <p className="text-xs text-slate-500 mt-2">
              You've reached your limit of {currentPlan.locationLimit} location{currentPlan.locationLimit === 1 ? '' : 's'} on the {currentPlan.name} plan
            </p>
          </div>
        ) : (
          <button
            onClick={() => navigate('/dashboard/locations/new')}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Location
          </button>
        )}
      </div>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No locations yet</h3>
          <p className="text-slate-600 mb-6">Create your first location to start collecting feedback</p>
          <button
            onClick={() => navigate('/dashboard/locations/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => navigate(`/dashboard/locations/${location.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Location Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {location.logoUrl ? (
                    <img
                      src={location.logoUrl}
                      alt={location.name}
                      className="h-10 w-10 rounded-lg object-contain border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-lg truncate">{location.name}</h3>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => handleEdit(location.id, e)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              {(location.phone || location.email) && (
                <div className="mb-4 space-y-1">
                  {location.phone && (
                    <p className="text-sm text-slate-600">📞 {location.phone}</p>
                  )}
                  {location.email && (
                    <p className="text-sm text-slate-600">✉️ {location.email}</p>
                  )}
                </div>
              )}

              {/* Review Platforms */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Review Platforms:</p>
                <div className="flex flex-wrap gap-2">
                  {location.reviewPlatforms.length > 0 ? (
                    location.reviewPlatforms.map((platform, idx) => (
                      <a
                        key={idx}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center gap-1"
                      >
                        {platform.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No platforms configured</span>
                  )}
                </div>
              </div>

              {/* Feedback URL */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">Feedback Page:</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => copyFeedbackUrl(location.id, e)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {copiedId === location.id ? (
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
                    href={`/l/${location.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Page
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}