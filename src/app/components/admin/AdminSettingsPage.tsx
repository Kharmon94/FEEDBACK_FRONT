import { useState, useEffect } from 'react';
import {
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
  Globe
} from 'lucide-react';
import { api, type AdminSettings } from '../../../services/api';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getAdminSettings()
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await api.updateAdminSettings(settings);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<AdminSettings>) => {
    if (settings) setSettings({ ...settings, ...patch });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Failed to load settings.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-600">Configure system-wide settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveMessage.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">General Settings</h3>
            <p className="text-sm text-slate-600">Basic system configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => update({ site_name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => update({ support_email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Max Locations Per User</label>
            <input
              type="number"
              min={1}
              value={settings.max_locations_per_user}
              onChange={(e) => update({ max_locations_per_user: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Feature Toggles</h3>
            <p className="text-sm text-slate-600">Enable or disable system features</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">User Registration</div>
              <div className="text-sm text-slate-600">Allow new users to sign up</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enable_user_registration}
              onChange={(e) => update({ enable_user_registration: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enable_user_registration ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Email Verification</div>
              <div className="text-sm text-slate-600">Require email verification for new accounts</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enable_email_verification}
              onChange={(e) => update({ enable_email_verification: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enable_email_verification ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Social Login</div>
              <div className="text-sm text-slate-600">Allow login via Google, etc.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enable_social_login}
              onChange={(e) => update({ enable_social_login: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enable_social_login ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
