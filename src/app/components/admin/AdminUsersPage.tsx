import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle,
  XCircle,
  Ban,
  Download
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
  mrr: number; // Monthly Recurring Revenue
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call to Rails backend
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      
      // Mock data for now
      setUsers([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          plan: 'pro',
          status: 'active',
          locationsCount: 3,
          feedbackCount: 245,
          createdAt: '2024-01-15',
          lastLogin: '2024-02-10',
          mrr: 59,
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          plan: 'business',
          status: 'active',
          locationsCount: 8,
          feedbackCount: 892,
          createdAt: '2023-11-20',
          lastLogin: '2024-02-14',
          mrr: 99,
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@startup.io',
          plan: 'starter',
          status: 'active',
          locationsCount: 1,
          feedbackCount: 67,
          createdAt: '2024-02-01',
          lastLogin: '2024-02-13',
          mrr: 29,
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma.w@business.com',
          plan: 'free',
          status: 'inactive',
          locationsCount: 0,
          feedbackCount: 5,
          createdAt: '2024-01-28',
          lastLogin: '2024-01-30',
          mrr: 0,
        },
        {
          id: '5',
          name: 'David Lee',
          email: 'david.lee@corp.com',
          plan: 'enterprise',
          status: 'active',
          locationsCount: 25,
          feedbackCount: 3456,
          createdAt: '2023-09-10',
          lastLogin: '2024-02-14',
          mrr: 299,
        },
      ]);
    } catch (error) {
      console.error('Error loading users:', error);
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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <Ban className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalMRR = filteredUsers.reduce((sum, user) => sum + user.mrr, 0);

  const exportUsers = () => {
    // TODO: Implement CSV export
    alert('Export users to CSV - TODO: Implement with Rails backend');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-slate-900 mb-2">User Management</h2>
          <p className="text-slate-600">
            {filteredUsers.length} users • ${totalMRR.toLocaleString()} MRR
          </p>
        </div>
        <button
          onClick={exportUsers}
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
              placeholder="Search by name or email..."
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
            {(filterPlan !== 'all' || filterStatus !== 'all') && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Plan</label>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
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
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Locations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 border rounded-full text-xs font-medium uppercase ${getPlanBadgeColor(user.plan)}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {user.locationsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {user.feedbackCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${user.mrr}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/users/${user.id}`);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
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
