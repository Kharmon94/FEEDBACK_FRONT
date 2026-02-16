import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  MapPin, 
  User,
  Star,
  MessageSquare,
  Calendar,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Mail,
  ExternalLink,
  BarChart3
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  userId: string;
  userName: string;
  userEmail: string;
  feedbackCount: number;
  avgRating: number;
  createdAt: string;
  lastFeedback: string | null;
  isActive: boolean;
  phoneNumber?: string;
  website?: string;
  qrCodeUrl?: string;
  formUrl: string;
}

interface FeedbackItem {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
}

interface LocationStats {
  totalFeedback: number;
  avgRating: number;
  positiveCount: number;
  negativeCount: number;
  recentFeedback: FeedbackItem[];
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export function AdminLocationDetail() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    if (locationId) {
      loadLocationDetails(locationId);
    }
  }, [locationId]);

  const loadLocationDetails = async (id: string) => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch(`/api/admin/locations/${id}`);
      // const data = await response.json();

      // Mock data
      const mockLocation: Location = {
        id: id,
        name: id === '1' ? 'Downtown Store' : id === '2' ? 'Main Street Cafe' : id === '3' ? 'West Side Shop' : id === '4' ? 'Harbor View Restaurant' : 'Old Location',
        address: `${100 + parseInt(id)} Main St, City, State 12345`,
        userId: id === '1' || id === '3' ? '1' : id === '2' ? '2' : id === '4' ? '5' : '4',
        userName: id === '1' || id === '3' ? 'John Smith' : id === '2' ? 'Sarah Johnson' : id === '4' ? 'David Lee' : 'Emma Wilson',
        userEmail: id === '1' || id === '3' ? 'john.smith@example.com' : id === '2' ? 'sarah.j@company.com' : id === '4' ? 'david.lee@corp.com' : 'emma.w@business.com',
        feedbackCount: id === '1' ? 156 : id === '2' ? 289 : id === '3' ? 67 : id === '4' ? 892 : 5,
        avgRating: id === '1' ? 4.3 : id === '2' ? 4.7 : id === '3' ? 3.9 : id === '4' ? 4.5 : 4.0,
        createdAt: id === '1' ? '2024-01-15' : id === '2' ? '2023-11-20' : id === '3' ? '2024-02-01' : id === '4' ? '2023-09-15' : '2024-01-28',
        lastFeedback: id === '5' ? '2024-01-30' : '2024-02-14',
        isActive: id !== '5',
        phoneNumber: '+1 (555) 123-4567',
        website: 'https://example.com',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example',
        formUrl: `https://feedback-page.com/f/${id}`,
      };

      setLocation(mockLocation);

      // Mock feedback data
      const mockRecentFeedback: FeedbackItem[] = [];
      for (let i = 0; i < Math.min(5, mockLocation.feedbackCount); i++) {
        mockRecentFeedback.push({
          id: `feedback-${i + 1}`,
          rating: Math.floor(Math.random() * 5) + 1,
          message: 'Great service and friendly staff! Really enjoyed my experience here.',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          customerName: `Customer ${i + 1}`,
          customerEmail: `customer${i + 1}@example.com`,
        });
      }

      const mockStats: LocationStats = {
        totalFeedback: mockLocation.feedbackCount,
        avgRating: mockLocation.avgRating,
        positiveCount: Math.floor(mockLocation.feedbackCount * 0.7),
        negativeCount: Math.floor(mockLocation.feedbackCount * 0.3),
        recentFeedback: mockRecentFeedback,
        ratingBreakdown: {
          5: Math.floor(mockLocation.feedbackCount * 0.5),
          4: Math.floor(mockLocation.feedbackCount * 0.25),
          3: Math.floor(mockLocation.feedbackCount * 0.15),
          2: Math.floor(mockLocation.feedbackCount * 0.07),
          1: Math.floor(mockLocation.feedbackCount * 0.03),
        },
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error loading location details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-700';
    if (rating >= 3.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  const handleDeactivateLocation = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch(`/api/admin/locations/${locationId}/deactivate`, {
      //   method: 'POST',
      // });
      // if (response.ok) {
      //   navigate('/admin/locations');
      // }
      
      console.log('Deactivating location:', locationId);
      alert('Location deactivated successfully');
      setShowDeactivateModal(false);
      navigate('/admin/locations');
    } catch (error) {
      console.error('Error deactivating location:', error);
      alert('Failed to deactivate location');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading location details...</div>
      </div>
    );
  }

  if (!location || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">Location not found</div>
        <button
          onClick={() => navigate('/admin/locations')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Locations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/locations')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
          <p className="text-slate-600">Viewing information for {location.name}</p>
        </div>
      </div>

      {/* Location Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{location.name}</h3>
                <p className="text-slate-600 mb-2">{location.address}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    location.isActive 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {location.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Total Feedback</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalFeedback}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Avg Rating</span>
          </div>
          <p className={`text-3xl font-bold ${getRatingColor(stats.avgRating)}`}>{stats.avgRating.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Positive</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.positiveCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-red-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Negative</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.negativeCount}</p>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Location Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Address</label>
            <p className="text-sm text-slate-900 mt-2">{location.address}</p>
          </div>
          {location.phoneNumber && (
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</label>
              <p className="text-sm text-slate-900 mt-2">{location.phoneNumber}</p>
            </div>
          )}
          {location.website && (
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Website</label>
              <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-1">
                {location.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Created</label>
            <p className="text-sm text-slate-900 mt-2">{new Date(location.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Feedback</label>
            <p className="text-sm text-slate-900 mt-2">
              {location.lastFeedback ? new Date(location.lastFeedback).toLocaleDateString() : 'Never'}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Feedback Form URL</label>
            <a href={location.formUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-1">
              {location.formUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Owner Information</h4>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-900">{location.userName}</div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {location.userEmail}
            </div>
          </div>
          <button
            onClick={() => navigate(`/admin/users/${location.userId}`)}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            View User
          </button>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Rating Breakdown</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown];
            const percentage = stats.totalFeedback > 0 ? (count / stats.totalFeedback) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-slate-700">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600 w-16 text-right">{count} ({percentage.toFixed(0)}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Recent Feedback</h4>
        {stats.recentFeedback.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No feedback yet</p>
        ) : (
          <div className="space-y-4">
            {stats.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= feedback.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{feedback.rating}.0</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-2">{feedback.message}</p>
                {feedback.customerName && (
                  <div className="text-xs text-slate-500">
                    {feedback.customerName} • {feedback.customerEmail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={() => navigate('/admin/feedback', { state: { locationId: location.id } })}
          className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          View All Feedback
        </button>
        <button className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
          Download QR Code
        </button>
        <button
          className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
          onClick={() => setShowDeactivateModal(true)}
        >
          Deactivate Location
        </button>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDeactivateModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3">Deactivate Location</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to deactivate <strong>{location.name}</strong>? This will prevent new feedback submissions.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                onClick={handleDeactivateLocation}
              >
                Deactivate
              </button>
              <button
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}