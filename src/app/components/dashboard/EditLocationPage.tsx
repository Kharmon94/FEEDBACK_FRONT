import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Trash2, Eye, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/client';
import { getBaseUrl, getToken } from '../../../services/api';
import { FeedbackPagePreview } from './FeedbackPagePreview';

interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  reviewPlatforms: Array<{ name: string; url: string; customName?: string }>;
  createdAt: string;
  emailNotifications?: boolean;
  notificationEmails?: string[];
  customMessage?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function EditLocationPage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [reviewPlatforms, setReviewPlatforms] = useState<Array<{ name: string; url: string; customName?: string }>>([
    { name: 'Google', url: '' }
  ]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [colorScheme, setColorScheme] = useState({
    primary: '#000000', // black
    secondary: '#ffffff', // white  
    accent: '#fbbf24' // yellow-400 for stars
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Collapsible sections state
  const [sectionsOpen, setSectionsOpen] = useState({
    basicInfo: true,
    reviewPlatforms: false,
    notifications: false,
    customization: false,
    colorScheme: false,
    dangerZone: false
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    loadLocation();
  }, [locationId]);

  const loadLocation = async () => {
    if (!locationId) return;
    
    try {
      const locations = await api.getLocations();
      const loc = locations.find(l => l.id === locationId);
      
      if (loc) {
        setLocation(loc);
        setName(loc.name);
        setAddress(loc.address);
        setPhone(loc.phone || '');
        setEmail(loc.email || '');
        setLogoPreview(loc.logoUrl || null);
        setReviewPlatforms(loc.reviewPlatforms.length > 0 ? loc.reviewPlatforms : [{ name: 'Google', url: '' }]);
        setEmailNotifications(loc.emailNotifications || true);
        setNotificationEmails(loc.notificationEmails || []);
        setCustomMessage(loc.customMessage || '');
        setColorScheme(loc.colorScheme || {
          primary: '#000000', // black
          secondary: '#ffffff', // white  
          accent: '#fbbf24' // yellow-400 for stars
        });
      } else {
        alert('Location not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to load location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) return;
    
    setSaving(true);

    try {
      let finalLogoUrl = logoPreview || '';

      // Upload logo via Rails Active Storage (S3) when file selected
      if (logoFile && logoPreview) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        formData.append('name', name);
        if (address) formData.append('address', address);
        if (phone) formData.append('phone', phone);
        if (email) formData.append('email', email);
        formData.append('custom_message', customMessage);
        formData.append('email_notifications', String(emailNotifications));
        formData.append('color_scheme[primary]', colorScheme.primary);
        formData.append('color_scheme[secondary]', colorScheme.secondary);
        formData.append('color_scheme[accent]', colorScheme.accent);
        notificationEmails.filter(e => e.trim()).forEach((e) => formData.append('notification_emails[]', e));
        const platformsObj: Record<string, string> = {};
        reviewPlatforms.filter(p => p.url).forEach((p) => {
          const key = p.name === 'Custom' && p.customName ? p.customName : p.name;
          platformsObj[key] = p.url;
        });
        Object.entries(platformsObj).forEach(([k, v]) => formData.append(`review_platforms[${k}]`, v));
        const token = getToken();
        const res = await fetch(`${getBaseUrl()}/locations/${locationId}`, {
          method: 'PUT',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (res.ok) {
          navigate('/dashboard');
          return;
        }
        const errText = await res.text();
        let errMsg: string;
        try {
          const parsed = errText ? JSON.parse(errText) : null;
          const raw = (parsed as { error?: string | string[] })?.error ?? res.statusText ?? 'Request failed';
          errMsg = Array.isArray(raw) ? raw.join('. ') : String(raw);
        } catch {
          errMsg = res.statusText || errText || 'Request failed';
        }
        throw new Error(errMsg);
      }

      const locationData = {
        name,
        address,
        phone: phone || undefined,
        email: email || undefined,
        logoUrl: finalLogoUrl || undefined,
        reviewPlatforms: reviewPlatforms
          .filter(p => p.url && (p.name !== 'Custom' || p.customName))
          .map(p => ({
            name: p.name === 'Custom' && p.customName ? p.customName : p.name,
            url: p.url
          })),
        emailNotifications,
        notificationEmails: notificationEmails.filter(e => e.trim() !== ''),
        customMessage,
        colorScheme
      };

      await api.updateLocation(locationId, locationData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update location:', error);
      const message = error instanceof Error ? error.message : 'Failed to update location. Please try again.';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const addPlatform = () => {
    setReviewPlatforms([...reviewPlatforms, { name: '', url: '' }]);
  };

  const removePlatform = (index: number) => {
    setReviewPlatforms(reviewPlatforms.filter((_, i) => i !== index));
  };

  const updatePlatform = (index: number, field: 'name' | 'url' | 'customName', value: string) => {
    const updated = [...reviewPlatforms];
    updated[index][field] = value;
    setReviewPlatforms(updated);
  };

  const addNotificationEmail = () => {
    if (notificationEmails.length < 5) {
      setNotificationEmails([...notificationEmails, '']);
    }
  };

  const removeNotificationEmail = (index: number) => {
    setNotificationEmails(notificationEmails.filter((_, i) => i !== index));
  };

  const updateNotificationEmail = (index: number, value: string) => {
    const updated = [...notificationEmails];
    updated[index] = value;
    setNotificationEmails(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/dashboard/locations/${locationId}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Location</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Edit Location</h1>
          <p className="text-slate-600 mt-1">{name || 'Loading...'}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('basicInfo')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
              {sectionsOpen.basicInfo ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {sectionsOpen.basicInfo && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-200 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Downtown Store"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St, City, State 12345"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="location@business.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Logo (Optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {logoPreview && (
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-20 w-20 object-contain rounded border border-slate-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">Logo Preview</p>
                          <p className="text-xs text-slate-500 truncate mt-1">
                            {logoFile ? logoFile.name : 'Current logo'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Platforms - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('reviewPlatforms')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-slate-900">Review Platforms</h2>
              {sectionsOpen.reviewPlatforms ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {sectionsOpen.reviewPlatforms && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={addPlatform}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    + Add Platform
                  </button>
                </div>
                {reviewPlatforms.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={platform.name}
                        onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                        className="w-full sm:w-1/3 px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Platform...</option>
                        <option value="Google">Google</option>
                        <option value="Yelp">Yelp</option>
                        <option value="Facebook">Facebook</option>
                        <option value="TripAdvisor">TripAdvisor</option>
                        <option value="Trustpilot">Trustpilot</option>
                        <option value="Custom">Custom Platform</option>
                      </select>
                      <div className="flex gap-2 flex-1">
                        <input
                          type="url"
                          value={platform.url}
                          onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                          className="flex-1 px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removePlatform(index)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {platform.name === 'Custom' && (
                      <input
                        type="text"
                        value={platform.customName || ''}
                        onChange={(e) => updatePlatform(index, 'customName', e.target.value)}
                        className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter custom platform name (e.g., BBB, Amazon, etc.)"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Settings - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('notifications')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
              {sectionsOpen.notifications ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {sectionsOpen.notifications && (
              <div className="px-4 pb-4 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-900">Email Notifications</label>
                    <p className="text-sm text-slate-600 mt-1">Receive email alerts when new feedback is submitted</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {emailNotifications && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notification Emails (up to 5)
                    </label>
                    <div className="space-y-2">
                      {notificationEmails.length === 0 ? (
                        <p className="text-sm text-slate-500 italic py-2">No notification emails added yet</p>
                      ) : (
                        notificationEmails.map((email, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => updateNotificationEmail(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter email address..."
                            />
                            <button
                              type="button"
                              onClick={() => removeNotificationEmail(index)}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))
                      )}
                      <button
                        type="button"
                        onClick={addNotificationEmail}
                        disabled={notificationEmails.length >= 5}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        + Add Email {notificationEmails.length >= 5 && '(Maximum reached)'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      These emails will receive notifications when new feedback is submitted (maximum 5 emails)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Design Customization - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('customization')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-slate-900">Design Customization</h2>
              {sectionsOpen.customization ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {sectionsOpen.customization && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-200 pt-4">
                {/* Preview Button */}
                <div className="flex justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Page
                  </button>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Welcome Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a custom welcome message for your feedback page..."
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    This message will be displayed at the top of the feedback page for this location
                  </p>
                </div>

                {/* Color Scheme */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-slate-700" />
                    <h3 className="text-base font-semibold text-slate-900">Color Scheme</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">
                        Primary Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorScheme.primary}
                          onChange={(e) => setColorScheme({...colorScheme, primary: e.target.value})}
                          className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorScheme.primary}
                          onChange={(e) => setColorScheme({...colorScheme, primary: e.target.value})}
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorScheme.secondary}
                          onChange={(e) => setColorScheme({...colorScheme, secondary: e.target.value})}
                          className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorScheme.secondary}
                          onChange={(e) => setColorScheme({...colorScheme, secondary: e.target.value})}
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">
                        Star Color (Accent)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorScheme.accent}
                          onChange={(e) => setColorScheme({...colorScheme, accent: e.target.value})}
                          className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorScheme.accent}
                          onChange={(e) => setColorScheme({...colorScheme, accent: e.target.value})}
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="#fbbf24"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Customize the colors of your feedback page to match your brand
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone - Collapsible */}
          <div className="border-2 border-red-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('dangerZone')}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors rounded-t-lg"
            >
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
              {sectionsOpen.dangerZone ? (
                <ChevronUp className="w-5 h-5 text-red-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-600" />
              )}
            </button>

            {sectionsOpen.dangerZone && (
              <div className="px-4 pb-4 bg-red-50 border-t-2 border-red-200 pt-4 rounded-b-lg space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Delete Location</p>
                  <p className="text-sm text-slate-600 mb-3">
                    Permanently delete this location and all associated feedback data. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete "${name}"? This will permanently delete the location and all associated feedback. This action cannot be undone.`)) {
                        try {
                          await api.deleteLocation(locationId!);
                          navigate('/dashboard');
                        } catch (error) {
                          console.error('Failed to delete location:', error);
                          alert('Failed to delete location. Please try again.');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 text-base text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              disabled={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Feedback Page Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-auto">
              <FeedbackPagePreview
                locationName={name}
                locationAddress={address}
                logoUrl={logoPreview}
                customMessage={customMessage}
                colorScheme={colorScheme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}