import { useState, useEffect } from 'react';
import { Save, MapPin } from 'lucide-react';
import { api } from '../../api/client';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationSettings {
  emailNotifications: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  customMessage: string;
}

export function SettingsPanel() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [settings, setSettings] = useState<LocationSettings>({
    emailNotifications: true,
    autoReplyEnabled: false,
    autoReplyMessage: '',
    customMessage: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (selectedLocationId) {
      loadSettings();
    }
  }, [selectedLocationId]);

  const loadLocations = async () => {
    try {
      const data = await api.getLocations();
      setLocations(data);
      
      // Auto-select first location
      if (data.length > 0) {
        setSelectedLocationId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      // TODO: Load location-specific settings from backend
      // For now, use default settings
      setSettings({
        emailNotifications: true,
        autoReplyEnabled: false,
        autoReplyMessage: 'Thank you for your feedback! We appreciate you taking the time to share your experience with us.',
        customMessage: ''
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedLocationId) return;
    
    setSaving(true);
    setSaved(false);

    try {
      // TODO: Save location-specific settings to backend
      // await api.updateLocationSettings(selectedLocationId, settings);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
        <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No locations yet</h3>
        <p className="text-slate-600">Create a location first to configure settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-600 mt-1">Configure location-specific settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !selectedLocationId}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Location Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Location</h3>
        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.address}
            </option>
          ))}
        </select>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">Email Notifications</label>
              <p className="text-sm text-slate-600 mt-1">Receive email alerts when new feedback is submitted</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Auto-Reply Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Auto-Reply Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">Enable Auto-Reply</label>
              <p className="text-sm text-slate-600 mt-1">Automatically send a response email to customers who submit feedback</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoReplyEnabled}
                onChange={(e) => setSettings({ ...settings, autoReplyEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.autoReplyEnabled && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Auto-Reply Message
              </label>
              <textarea
                value={settings.autoReplyMessage}
                onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the message that will be sent to customers..."
              />
              <p className="text-xs text-slate-500 mt-2">
                This message will be sent automatically when customers submit feedback
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Feedback Page Message */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Feedback Page Customization</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Welcome Message (Optional)
            </label>
            <textarea
              value={settings.customMessage}
              onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a custom welcome message for your feedback page..."
            />
            <p className="text-xs text-slate-500 mt-2">
              This message will be displayed at the top of the feedback page for this location
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-700 mb-3">
              Delete all feedback data for this location. This action cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all feedback for this location? This action cannot be undone.')) {
                  // TODO: Implement delete feedback functionality
                  alert('Delete feedback functionality will be implemented');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete All Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
