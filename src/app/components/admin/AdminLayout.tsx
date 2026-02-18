import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  MessageSquare, 
  Lightbulb,
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
const logo = "/logo.png";
import { useAuth } from '../../contexts/AuthContext';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (!user.admin) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/locations', label: 'Locations', icon: MapPin },
    { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/admin/suggestions', label: 'Suggestions', icon: Lightbulb },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  if (loading || !user || !user.admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Feedback Page" className="h-16" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg absolute right-4 z-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu - Positioned absolutely to overlay content */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
              
              {/* Sign Out in Mobile Menu */}
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left border-t border-slate-200 mt-2 pt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200">
          <div className="h-screen flex flex-col sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b border-slate-200">
              <img src={logo} alt="Feedback Page" className="h-20 w-auto object-contain" />
              <div className="mt-3 px-3 py-2 bg-slate-900 rounded-lg text-center">
                <p className="text-xs font-semibold text-white uppercase tracking-wide">Admin Panel</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-200">
              {user && (
                <div className="mb-3 px-4 py-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Admin</p>
                  <p className="text-sm text-slate-600 truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
          
          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200">
            <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Feedback Page. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}