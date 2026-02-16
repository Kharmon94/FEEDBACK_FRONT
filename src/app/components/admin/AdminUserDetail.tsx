import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  Ban,
  MessageSquare,
  Star,
  DollarSign,
  User as UserIcon,
  TrendingUp,
  Phone,
  Building
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  locationsCount: number;
  feedbackCount: number;
  createdAt: string;
  lastLogin: string;
  mrr: number;
  phone?: string;
  company?: string;
  totalRevenue: number;
  billingPeriod: 'monthly' | 'annual';
  nextBillingDate: string;
  paymentMethod: string;
}

interface UserLocation {
  id: string;
  name: string;
  address: string;
  feedbackCount: number;
  avgRating: number;
  createdAt: string;
}

export function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserDetails(userId);
    }
  }, [userId]);

  const loadUserDetails = async (id: string) => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch(`/api/admin/users/${id}`);
      // const data = await response.json();

      // Mock data
      const mockUser: User = {
        id: id,
        name: id === '1' ? 'John Smith' : id === '2' ? 'Sarah Johnson' : id === '3' ? 'Mike Chen' : id === '4' ? 'Emma Wilson' : 'David Lee',
        email: id === '1' ? 'john.smith@example.com' : id === '2' ? 'sarah.j@company.com' : id === '3' ? 'mike.chen@startup.io' : id === '4' ? 'emma.w@business.com' : 'david.lee@corp.com',
        plan: id === '1' ? 'pro' : id === '2' ? 'business' : id === '3' ? 'starter' : id === '4' ? 'free' : 'enterprise',
        status: id === '4' ? 'inactive' : 'active',
        locationsCount: id === '1' ? 3 : id === '2' ? 8 : id === '3' ? 1 : id === '4' ? 0 : 25,
        feedbackCount: id === '1' ? 245 : id === '2' ? 892 : id === '3' ? 67 : id === '4' ? 5 : 3456,
        createdAt: id === '1' ? '2024-01-15' : id === '2' ? '2023-11-20' : id === '3' ? '2024-02-01' : id === '4' ? '2024-01-28' : '2023-09-10',
        lastLogin: id === '1' ? '2024-02-10' : id === '2' ? '2024-02-14' : id === '3' ? '2024-02-13' : id === '4' ? '2024-01-30' : '2024-02-14',
        mrr: id === '1' ? 59 : id === '2' ? 99 : id === '3' ? 29 : id === '4' ? 0 : 299,
        phone: '+1 (555) 123-4567',
        company: id === '4' ? undefined : 'Example Company Inc.',
        totalRevenue: 0,
        billingPeriod: 'monthly',
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: id === '4' ? 'None' : '•••• 4242',
      };
      mockUser.totalRevenue = mockUser.mrr * 12;

      setUser(mockUser);

      // Generate mock locations
      const mockLocations: UserLocation[] = [];
      for (let i = 0; i < mockUser.locationsCount; i++) {
        mockLocations.push({
          id: `loc-${i + 1}`,
          name: `Location ${i + 1}`,
          address: `${100 + i} Main St, City, State 12345`,
          feedbackCount: Math.floor(Math.random() * 200) + 10,
          avgRating: Math.random() * 2 + 3,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      setLocations(mockLocations);
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeColor = (plan: User['plan']) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'business':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pro':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'starter':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'free':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <Ban className="w-4 h-4" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">User not found</div>
        <button
          onClick={() => navigate('/admin/users')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">User Details</h2>
          <p className="text-slate-600">Viewing information for {user.name}</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h3>
                <p className="text-slate-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              {getStatusBadge(user.status)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {user.company}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Locations</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{user.locationsCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Feedback</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{user.feedbackCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">MRR</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${user.mrr}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-700" />
            </div>
            <span className="text-sm font-medium text-slate-600">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${user.totalRevenue}</p>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Account Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Account Status</label>
            <div className="mt-2">{getStatusBadge(user.status)}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Created</label>
            <p className="text-sm text-slate-900 mt-2">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Login</label>
            <p className="text-sm text-slate-900 mt-2">{new Date(user.lastLogin).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Subscription Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current Plan</label>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1.5 border rounded-full text-sm font-medium uppercase ${getPlanBadgeColor(user.plan)}`}>
                {user.plan}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Billing Period</label>
            <p className="text-sm text-slate-900 mt-2 capitalize">{user.billingPeriod}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payment Method</label>
            <p className="text-sm text-slate-900 mt-2">{user.paymentMethod}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Next Billing Date</label>
            <p className="text-sm text-slate-900 mt-2">
              {user.plan === 'free' ? 'N/A' : new Date(user.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Locations ({locations.length})</h4>
        {locations.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No locations yet</p>
        ) : (
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <h5 className="font-medium text-slate-900">{location.name}</h5>
                  </div>
                  <p className="text-sm text-slate-600 ml-6">{location.address}</p>
                  <div className="flex items-center gap-4 ml-6 mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MessageSquare className="w-3 h-3" />
                      {location.feedbackCount} feedback
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3" />
                      {location.avgRating.toFixed(1)} avg rating
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Added {new Date(location.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Send Email
        </button>
        <button className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
          View Activity Log
        </button>
        <button className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors">
          Suspend User
        </button>
      </div>
    </div>
  );
}
