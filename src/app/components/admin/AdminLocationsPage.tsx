import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Filter, 
  MapPin, 
  User,
  Star,
  MessageSquare,
  ExternalLink,
  Download
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userEmail: string;
  feedbackCount: number;
  avgRating: number;
  createdAt: string;
  lastFeedback: string | null;
  isActive: boolean;
}

export function AdminLocationsPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch('/api/admin/locations');
      // const data = await response.json();
      
      // Mock data for now
      setLocations([
        {
          id: '1',
          name: 'Downtown Store',
          userId: '1',
          userName: 'John Smith',
          userEmail: 'john.smith@example.com',
          feedbackCount: 156,
          avgRating: 4.3,
          createdAt: '2024-01-15',
          lastFeedback: '2024-02-14',
          isActive: true,
        },
        {
          id: '2',
          name: 'Main Street Cafe',
          userId: '2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@company.com',
          feedbackCount: 289,
          avgRating: 4.7,
          createdAt: '2023-11-20',
          lastFeedback: '2024-02-13',
          isActive: true,
        },
        {
          id: '3',
          name: 'West Side Shop',
          userId: '1',
          userName: 'John Smith',
          userEmail: 'john.smith@example.com',
          feedbackCount: 67,
          avgRating: 3.9,
          createdAt: '2024-02-01',
          lastFeedback: '2024-02-12',
          isActive: true,
        },
        {
          id: '4',
          name: 'Harbor View Restaurant',
          userId: '5',
          userName: 'David Lee',
          userEmail: 'david.lee@corp.com',
          feedbackCount: 892,
          avgRating: 4.5,
          createdAt: '2023-09-15',
          lastFeedback: '2024-02-14',
          isActive: true,
        },
        {
          id: '5',
          name: 'Old Location',
          userId: '4',
          userName: 'Emma Wilson',
          userEmail: 'emma.w@business.com',
          feedbackCount: 5,
          avgRating: 4.0,
          createdAt: '2024-01-28',
          lastFeedback: '2024-01-30',
          isActive: false,
        },
      ]);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && location.isActive) ||
      (filterStatus === 'inactive' && !location.isActive);
    return matchesSearch && matchesStatus;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-700';
    if (rating >= 3.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  const exportLocations = () => {
    // TODO: Implement CSV export
    alert('Export locations to CSV - TODO: Implement with Rails backend');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Locations</h2>
          <p className="text-slate-600">{filteredLocations.length} total locations</p>
        </div>
        <button
          onClick={exportLocations}
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
              placeholder="Search by location name, user name, or email..."
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
            {filterStatus !== 'all' && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Avg Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No locations found
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr 
                    key={location.id} 
                    onClick={() => navigate(`/admin/locations/${location.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{location.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{location.userName}</div>
                        <div className="text-sm text-slate-500">{location.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-900">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        {location.feedbackCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 text-sm font-medium ${getRatingColor(location.avgRating)}`}>
                        <Star className="w-4 h-4 fill-current" />
                        {location.avgRating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {location.lastFeedback 
                        ? new Date(location.lastFeedback).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        location.isActive 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {location.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/locations/${location.id}`);
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
      </div>
    </div>
  );
}