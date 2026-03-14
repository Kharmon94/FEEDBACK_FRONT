import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Save, User, Mail, Lock, ExternalLink, ChevronRight, AlertTriangle } from 'lucide-react';
import { api } from '../../api/client';
import { api as railsApi } from '../../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Profile {
  id: number;
  email: string;
  unconfirmed_email?: string;
  name?: string;
  business_name?: string;
  provider?: string;
}

export function SettingsPanel() {
  const { signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [emailPrefsSummary, setEmailPrefsSummary] = useState<{ enabled: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [name, setName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Email form state
  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Close account state
  const [closeConfirmChecked, setCloseConfirmChecked] = useState(false);
  const [closePassword, setClosePassword] = useState('');
  const [closeDeleting, setCloseDeleting] = useState(false);
  const [closeError, setCloseError] = useState('');

  const hasPassword = !profile?.provider;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, emailData] = await Promise.all([
        api.getProfile(),
        railsApi.getEmailPreferences().catch(() => null),
      ]);
      setProfile(profileData);
      setName(profileData.name ?? '');
      setNewEmail(profileData.email ?? '');
      setEmailPrefsSummary(emailData ? { enabled: emailData.email_notifications_enabled } : null);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const res = await api.updateProfile({ name: name || undefined });
      setProfile(res.profile as Profile);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      if (res.user) await refreshUser();
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim();
    if (!trimmed || trimmed === profile?.email) return;
    setEmailError('');
    setEmailMessage('');
    setEmailSaving(true);
    try {
      const res = await api.updateProfile({ email: trimmed });
      setProfile(res.profile as Profile);
      setEmailMessage(res.message ?? 'Email updated successfully.');
      if (res.user) await refreshUser();
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setEmailSaving(false);
    }
  };

  const handleCloseAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeConfirmChecked) return;
    if (hasPassword && !closePassword.trim()) {
      setCloseError('Please enter your password to confirm.');
      return;
    }
    setCloseError('');
    setCloseDeleting(true);
    try {
      await railsApi.deleteAccount(hasPassword ? closePassword : undefined);
      await signOut();
      navigate('/', { replace: true });
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : 'Failed to close account');
    } finally {
      setCloseDeleting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordError('');
    setPasswordSuccess(false);
    setPasswordSaving(true);
    try {
      await api.changePassword({ current_password: currentPassword, password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-tour="settings">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Account
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {profileError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{profileError}</div>
          )}
          {profileSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">Profile saved</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="Your name"
            />
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {profileSaving ? 'Saving...' : profileSaved ? 'Saved!' : 'Save profile'}
          </button>
        </form>
      </div>

      {/* Change Email */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email address
        </h3>
        {profile?.unconfirmed_email ? (
          <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded-lg mb-4">
            A confirmation link was sent to {profile.unconfirmed_email}. Click it to complete the change.
          </p>
        ) : (
          <form onSubmit={handleSaveEmail} className="space-y-4">
            {emailError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{emailError}</div>
            )}
            {emailMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">{emailMessage}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={emailSaving || newEmail.trim() === profile?.email}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {emailSaving ? 'Saving...' : 'Update email'}
            </button>
          </form>
        )}
      </div>

      {/* Change Password - only for non-OAuth users */}
      {hasPassword && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">Password updated</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={passwordSaving || !currentPassword || !newPassword}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {passwordSaving ? 'Updating...' : 'Change password'}
            </button>
          </form>
        </div>
      )}

      {/* Preferences Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Email notifications</p>
            <p className="text-sm text-slate-600 mt-1">
              {emailPrefsSummary != null
                ? emailPrefsSummary.enabled ? 'Notifications are on' : 'Notifications are off'
                : 'Manage which emails you receive'}
            </p>
          </div>
          <Link
            to="/email-preferences"
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Manage <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/dashboard?tab=billing')}
            className="w-full flex items-center justify-between px-4 py-3 text-left rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900">Billing & plan</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Close account */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Close account
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <form onSubmit={handleCloseAccount} className="space-y-4">
          {closeError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{closeError}</div>
          )}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={closeConfirmChecked}
              onChange={(e) => setCloseConfirmChecked(e.target.checked)}
              className="mt-1 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              I understand this will permanently delete my account and data.
            </span>
          </label>
          {hasPassword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm your password</label>
              <input
                type="password"
                value={closePassword}
                onChange={(e) => setClosePassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
                placeholder="••••••••"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={!closeConfirmChecked || closeDeleting || (hasPassword && !closePassword.trim())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {closeDeleting ? 'Closing account...' : 'Close account'}
          </button>
        </form>
      </div>
    </div>
  );
}
