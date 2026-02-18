import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  MapPin,
  User,
  Star,
  MessageSquare,
  Mail,
  ExternalLink
} from 'lucide-react';
import { api, type AdminLocation } from '../../../services/api';

export function AdminLocationDetail() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<AdminLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locationId) {
      setLoading(true);
      setError(null);
      api.getAdminLocation(locationId)
        .then(setLocation)
        .catch((e) => {
          console.error('Error loading location:', e);
          setError(e instanceof Error ? e.message : 'Failed to load location');
          setLocation(null);
        })
        .finally(() => setLoading(false));
    }
  }, [locationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading location details...</div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">{error ?? 'Location not found'}</div>
        <button
          onClick={() => navigate('/admin/locations')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Locations
        </button>
      </div>
    );
  }

  const getRatingColor = (rating: number | null) => {
    if (rating == null) return 'text-slate-500';
    if (rating >= 4.5) return 'text-green-700';
    if (rating >= 3.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/locations')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
          <p className="text-slate-600">Viewing {location.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{location.name}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>Created {location.created_at ? new Date(location.created_at).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Feedback</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{location.feedback_count.toLocaleString()}</p>
          <a
            href={`/admin/feedback?location_id=${location.id}`}
            className="text-sm text-slate-600 hover:text-slate-900 mt-1 inline-flex items-center gap-1"
          >
            View feedback for this location
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Avg Rating</span>
          </div>
          <p className={`text-3xl font-bold ${getRatingColor(location.avg_rating)}`}>
            {location.avg_rating != null ? location.avg_rating.toFixed(1) : '—'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Owner</h4>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-900">{location.user_name ?? '—'}</div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {location.user_email}
            </div>
          </div>
          <button
            onClick={() => navigate(`/admin/users/${location.user_id}`)}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            View user
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/admin/feedback?location_id=${location.id}`)}
          className="px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          View all feedback for this location
        </button>
      </div>
    </div>
  );
}
