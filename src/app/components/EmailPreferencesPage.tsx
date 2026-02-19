import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';
const logo = "/logo.png";
import { Footer } from './Footer';

export function EmailPreferencesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [emailMarketingOptOut, setEmailMarketingOptOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/email-preferences' } } });
      return;
    }
    if (user) loadPreferences();
  }, [user, authLoading, navigate]);

  const loadPreferences = async () => {
    try {
      const data = await api.getEmailPreferences();
      setEmailNotificationsEnabled(data.email_notifications_enabled);
      setEmailMarketingOptOut(data.email_marketing_opt_out);
    } catch {
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      await api.updateEmailPreferences({
        email_notifications_enabled: emailNotificationsEnabled,
        email_marketing_opt_out: emailMarketingOptOut,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribeAll = () => {
    setEmailNotificationsEnabled(false);
    setEmailMarketingOptOut(true);
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Feedback Page" className="h-14 md:h-20" />
            </Link>
            <div className="flex gap-3">
              <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-slate-900">Help</Link>
              <Link to="/dashboard" className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg">Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Email preferences</h1>
            <p className="text-slate-600 mt-1">Manage which emails you receive from Feedback Page</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {saved && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">Preferences saved</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={emailNotificationsEnabled} onChange={(e) => setEmailNotificationsEnabled(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                  <span>
                    <span className="font-medium text-slate-900 block">Receive email notifications</span>
                    <span className="text-sm text-slate-600">Get notified about new feedback, suggestions, and account updates</span>
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={emailMarketingOptOut} onChange={(e) => setEmailMarketingOptOut(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                  <span>
                    <span className="font-medium text-slate-900 block">Opt out of marketing emails</span>
                    <span className="text-sm text-slate-600">Unsubscribe from product updates and promotional emails</span>
                  </span>
                </label>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button type="button" onClick={handleUnsubscribeAll} className="text-sm text-slate-600 hover:text-red-600 underline">Unsubscribe from all emails</button>
                <p className="text-xs text-slate-500 mt-1">You will still receive essential account emails (e.g. password reset)</p>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50">{saving ? 'Saving...' : 'Save preferences'}</button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link to="/help" className="text-slate-900 font-medium hover:underline">Help center</Link>
            {' · '}
            <Link to="/contact-us" className="text-slate-900 font-medium hover:underline">Contact support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
