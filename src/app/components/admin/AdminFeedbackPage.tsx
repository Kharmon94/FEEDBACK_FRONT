import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star,
  MapPin,
  User,
  Calendar,
  Download,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  locationId: string;
  locationName: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  hasImages: boolean;
  phoneNumber?: string;
  contactMe: boolean;
  customerName?: string;
  customerEmail?: string;
}

export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch('/api/admin/feedback');
      // const data = await response.json();
      
      // Mock data for now
      setFeedback([
        {
          id: '1',
          rating: 5,
          comment: 'Excellent service! The staff was very helpful and friendly.',
          locationId: '1',
          locationName: 'Downtown Store',
          userId: '1',
          userName: 'John Smith',
          userEmail: 'john.smith@example.com',
          createdAt: '2024-02-14T10:30:00Z',
          hasImages: false,
          contactMe: false,
          customerName: 'Alice Brown',
          customerEmail: 'alice.b@email.com',
        },
        {
          id: '2',
          rating: 2,
          comment: 'Long wait times and the product quality was not up to expectations.',
          locationId: '2',
          locationName: 'Main Street Cafe',
          userId: '2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@company.com',
          createdAt: '2024-02-14T09:15:00Z',
          hasImages: true,
          phoneNumber: '555-0123',
          contactMe: true,
          customerName: 'Bob Wilson',
        },
        {
          id: '3',
          rating: 4,
          comment: 'Good overall experience. Could improve the checkout process.',
          locationId: '1',
          locationName: 'Downtown Store',
          userId: '1',
          userName: 'John Smith',
          userEmail: 'john.smith@example.com',
          createdAt: '2024-02-13T16:45:00Z',
          hasImages: false,
          contactMe: false,
        },
        {
          id: '4',
          rating: 1,
          comment: 'Very disappointed with the service. The staff was rude and unhelpful.',
          locationId: '4',
          locationName: 'Harbor View Restaurant',
          userId: '5',
          userName: 'David Lee',
          userEmail: 'david.lee@corp.com',
          createdAt: '2024-02-13T14:20:00Z',
          hasImages: true,
          phoneNumber: '555-0456',
          contactMe: true,
          customerName: 'Carol Martinez',
          customerEmail: 'carol.m@email.com',
        },
        {
          id: '5',
          rating: 5,
          comment: 'Amazing! Will definitely come back again. Highly recommended!',
          locationId: '2',
          locationName: 'Main Street Cafe',
          userId: '2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@company.com',
          createdAt: '2024-02-13T11:30:00Z',
          hasImages: false,
          contactMe: false,
          customerName: 'Dan Thompson',
        },
      ]);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch = 
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = 
      filterRating === 'all' || 
      (filterRating === 'positive' && item.rating >= 4) ||
      (filterRating === 'negative' && item.rating <= 3) ||
      item.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-700';
    if (rating === 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const exportFeedback = () => {
    // TODO: Implement CSV export
    alert('Export feedback to CSV - TODO: Implement with Rails backend');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Feedback Management</h2>
          <p className="text-slate-600">{filteredFeedback.length} total submissions</p>
        </div>
        <button
          onClick={exportFeedback}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by comment, location, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Filter Toggle */}
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

        {/* Filter Dropdowns */}
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
                <option value="positive">Positive (4-5 stars)</option>
                <option value="negative">Negative (1-3 stars)</option>
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

      {/* Feedback List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
        {filteredFeedback.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No feedback found
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
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
                  {formatDate(item.createdAt)}
                </div>
              </div>

              <p className="text-slate-900 mb-4">{item.comment}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{item.locationName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{item.userName}</span>
                </div>
                {item.customerName && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">From:</span>
                    <span>{item.customerName}</span>
                  </div>
                )}
                {item.hasImages && (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>Has Images</span>
                  </div>
                )}
                {item.contactMe && (
                  <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Wants Contact
                  </div>
                )}
              </div>

              {item.contactMe && item.phoneNumber && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
                  <span className="font-medium text-orange-900">Contact Info: </span>
                  <span className="text-orange-700">{item.phoneNumber}</span>
                  {item.customerEmail && (
                    <>
                      <span className="text-orange-700"> • </span>
                      <span className="text-orange-700">{item.customerEmail}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
