import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Trash2, Eye } from 'lucide-react';
import { api } from '../../api/client';
import { FeedbackPagePreview } from './FeedbackPagePreview';

export function AddLocationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Step 2: Review Platforms
  const [reviewPlatforms, setReviewPlatforms] = useState<Array<{ name: string; url: string; customName?: string }>>([
    { name: 'Google', url: '' }
  ]);
  
  // Step 3: Design Customization
  const [customMessage, setCustomMessage] = useState('');
  const [colorScheme, setColorScheme] = useState({
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#fbbf24'
  });
  const [showPreview, setShowPreview] = useState(false);
  
  const [saving, setSaving] = useState(false);

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Location details' },
    { number: 2, title: 'Review Platforms', description: 'Where to send reviews' },
    { number: 3, title: 'Design', description: 'Customize your page' }
  ];

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
    setSaving(true);

    try {
      let finalLogoUrl = '';

      if (logoFile && logoPreview) {
        finalLogoUrl = logoPreview;
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
        customMessage: customMessage || undefined,
        colorScheme: colorScheme || undefined
      };

      await api.createLocation(locationData);
      navigate('/dashboard?tab=locations', { state: { fromCreate: true } });
    } catch (error) {
      console.error('Failed to save location:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save location: ${msg}`);
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

  const handleColorChange = (field: 'primary' | 'secondary' | 'accent', value: string) => {
    setColorScheme({
      ...colorScheme,
      [field]: value
    });
  };

  const canProceedFromStep1 = name.trim() !== '' && address.trim() !== '';
  const canProceedFromStep2 = reviewPlatforms.some(p => p.url && (p.name !== 'Custom' || p.customName));

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard?tab=locations')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Locations</span>
        </button>
        <h1 className="text-slate-900 text-[24px] text-center">Add New Location</h1>
        
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center max-w-2xl mx-auto px-2 sm:px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-black text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                </div>
                <div className="mt-2 text-center w-16 sm:w-24">
                  <p className={`text-[10px] sm:text-sm font-semibold leading-tight ${
                    currentStep >= step.number ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-8 sm:w-20 mx-1 sm:mx-3 transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
        <form onSubmit={(e) => { e.preventDefault(); if (currentStep === 3) handleSubmit(e); }}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Basic Information</h2>
                <p className="text-sm text-slate-600">Tell us about your location</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="123 Main St, City, State 12345"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
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

          {/* Step 2: Review Platforms */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Review Platforms</h2>
                <p className="text-sm text-slate-600">Add where you'd like happy customers to leave reviews</p>
              </div>

              <div className="space-y-3">
                {reviewPlatforms.map((platform, index) => (
                  <div key={index} className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={platform.name}
                        onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                        className="w-full sm:w-2/5 px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
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
                          className="flex-1 px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removePlatform(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
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
                        className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                        placeholder="Enter custom platform name (e.g., BBB, Amazon, etc.)"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPlatform}
                className="w-full py-3 text-base text-black border-2 border-dashed border-slate-300 rounded-lg hover:border-black hover:bg-slate-50 transition-colors font-medium"
              >
                + Add Another Platform
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <strong>Tip:</strong> Add at least one review platform. Customers with 4-5 star ratings will be directed to these platforms to leave public reviews.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Design Customization */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Design Customization</h2>
                <p className="text-sm text-slate-600">Make the feedback page match your brand</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Welcome Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="e.g., 'We'd love to hear about your experience at our Downtown Store!'"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This message will be displayed at the top of the feedback page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Color Scheme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Primary Text Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorScheme.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-14 h-14 rounded-lg border-2 border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorScheme.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorScheme.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-14 h-14 rounded-lg border-2 border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorScheme.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Star/Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorScheme.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-14 h-14 rounded-lg border-2 border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorScheme.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-mono"
                        placeholder="#fbbf24"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-black border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium mx-auto"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Preview Your Feedback Page'}
                </button>
              </div>

              {showPreview && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4 text-center">Preview</h3>
                  <FeedbackPagePreview
                    locationName={name || 'Your Location'}
                    locationAddress={address || 'Your Address'}
                    phone={phone}
                    email={email}
                    logoUrl={logoPreview || undefined}
                    reviewPlatforms={reviewPlatforms
                      .filter(p => p.url && (p.name !== 'Custom' || p.customName))
                      .map(p => ({
                        name: p.name === 'Custom' && p.customName ? p.customName : p.name,
                        url: p.url
                      }))}
                    customMessage={customMessage}
                    colorScheme={colorScheme}
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard?tab=locations')}
              className="w-full sm:w-auto px-6 py-3 text-base text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto px-6 py-3 text-base text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 ? !canProceedFromStep1 : currentStep === 2 ? !canProceedFromStep2 : false}
                  className="w-full sm:w-auto px-6 py-3 text-base bg-black text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 text-base bg-black text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Create Location
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}