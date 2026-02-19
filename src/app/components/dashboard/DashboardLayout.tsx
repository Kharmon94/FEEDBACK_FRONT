import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, MapPin, CreditCard, Gift, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const logo = "/logo.png";
import { TrialBanner } from './TrialBanner';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: { pathname: location.pathname } } });
    }
  }, [user, loading, navigate, location.pathname]);

  // Trial data from backend: trial starts at signup, 30 days for free plan
  const trialEndsAt = user?.trial_ends_at ? new Date(user.trial_ends_at) : null;
  const hasPaymentMethod = user?.has_payment_method ?? false;
  const today = new Date();
  const daysRemaining = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  // No trial_ends_at means paid plan or legacy user - treat as no trial restriction
  const isTrialActive = trialEndsAt ? daysRemaining > 0 : true;
  const showTrialBanner = isTrialActive && !hasPaymentMethod && trialEndsAt != null && daysRemaining <= 15;

  // Redirect to trial expired only when: trial ended, no payment, and user data loaded
  const allowedPathsWhenExpired = ['/dashboard/trial-expired', '/dashboard/plans', '/dashboard/contact-support'];
  const shouldRedirectToTrialExpired =
    !loading &&
    user != null &&
    trialEndsAt != null &&
    !isTrialActive &&
    !hasPaymentMethod &&
    !allowedPathsWhenExpired.some((path) => location.pathname === path);

  if (shouldRedirectToTrialExpired && location.pathname !== '/dashboard/trial-expired') {
    navigate('/dashboard/trial-expired', { replace: true });
  }

  // Show loading while checking auth; don't render dashboard for unauthenticated users
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard?tab=overview' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/dashboard?tab=feedback' },
    { id: 'locations', label: 'Locations', icon: MapPin, path: '/dashboard?tab=locations' },
    { id: 'opt-ins', label: 'Opt-Ins', icon: Gift, path: '/dashboard?tab=opt-ins' },
    { id: 'billing', label: 'Billing', icon: CreditCard, path: '/dashboard?tab=billing' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/dashboard?tab=help' },
  ];

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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(tab.path);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-slate-600 hover:bg-slate-50"
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              
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
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-200">
              {user && (
                <div className="mb-3 px-4 py-2 bg-slate-50 rounded-lg">
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
          {showTrialBanner && <TrialBanner daysRemaining={daysRemaining} />}
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