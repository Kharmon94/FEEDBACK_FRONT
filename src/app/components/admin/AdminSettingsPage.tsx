import { useState, useEffect } from 'react';
import { 
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Shield,
  Database,
  Bell,
  CreditCard,
  Globe
} from 'lucide-react';

interface SystemSettings {
  // General
  siteName: string;
  supportEmail: string;
  maxLocationsPerUser: number;
  
  // Features
  enableUserRegistration: boolean;
  enableEmailVerification: boolean;
  enableSocialLogin: boolean;
  
  // Email
  emailProvider: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  
  // Security
  sessionTimeout: number;
  passwordMinLength: number;
  require2FA: boolean;
  
  // Billing
  stripePublicKey: string;
  enableTrialPeriod: boolean;
  trialDays: number;
  
  // Notifications
  adminEmailAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Feedback Page',
    supportEmail: 'support@feedback-page.com',
    maxLocationsPerUser: 100,
    enableUserRegistration: true,
    enableEmailVerification: false,
    enableSocialLogin: true,
    emailProvider: 'sendgrid',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    smtpUsername: 'apikey',
    sessionTimeout: 24,
    passwordMinLength: 8,
    require2FA: false,
    stripePublicKey: 'pk_test_...',
    enableTrialPeriod: true,
    trialDays: 14,
    adminEmailAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage(null);

    try {
      // TODO: Replace with actual API call to Rails backend
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-600">Configure system-wide settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Save Message */}
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

      {/* General Settings */}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Locations Per User
            </label>
            <input
              type="number"
              value={settings.maxLocationsPerUser}
              onChange={(e) => setSettings({ ...settings, maxLocationsPerUser: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
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
              checked={settings.enableUserRegistration}
              onChange={(e) => setSettings({ ...settings, enableUserRegistration: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enableUserRegistration ? 'translate-x-5' : ''
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
              checked={settings.enableEmailVerification}
              onChange={(e) => setSettings({ ...settings, enableEmailVerification: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enableEmailVerification ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Social Login</div>
              <div className="text-sm text-slate-600">Allow login via Google, Facebook, etc.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableSocialLogin}
              onChange={(e) => setSettings({ ...settings, enableSocialLogin: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enableSocialLogin ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Email Configuration</h3>
            <p className="text-sm text-slate-600">SMTP settings for email delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Provider
            </label>
            <select
              value={settings.emailProvider}
              onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="ses">Amazon SES</option>
              <option value="smtp">Custom SMTP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={settings.smtpPort}
              onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Billing Settings</h3>
            <p className="text-sm text-slate-600">Payment and subscription configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stripe Public Key
            </label>
            <input
              type="text"
              value={settings.stripePublicKey}
              onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="pk_test_..."
            />
          </div>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Enable Trial Period</div>
              <div className="text-sm text-slate-600">Offer free trial for new users</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableTrialPeriod}
              onChange={(e) => setSettings({ ...settings, enableTrialPeriod: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.enableTrialPeriod ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          {settings.enableTrialPeriod && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trial Period (Days)
              </label>
              <input
                type="number"
                value={settings.trialDays}
                onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-yellow-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Admin Notifications</h3>
            <p className="text-sm text-slate-600">Configure admin email alerts and reports</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Email Alerts</div>
              <div className="text-sm text-slate-600">Receive alerts for important system events</div>
            </div>
            <input
              type="checkbox"
              checked={settings.adminEmailAlerts}
              onChange={(e) => setSettings({ ...settings, adminEmailAlerts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.adminEmailAlerts ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Weekly Reports</div>
              <div className="text-sm text-slate-600">Receive weekly analytics summary</div>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.weeklyReports ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <div className="font-medium text-slate-900">Monthly Reports</div>
              <div className="text-sm text-slate-600">Receive monthly performance reports</div>
            </div>
            <input
              type="checkbox"
              checked={settings.monthlyReports}
              onChange={(e) => setSettings({ ...settings, monthlyReports: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full peer-focus:ring-2 peer-focus:ring-slate-900/20 transition-colors">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                settings.monthlyReports ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}