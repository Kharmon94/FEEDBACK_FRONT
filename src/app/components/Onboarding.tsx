import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Check, ChevronRight, ChevronLeft, Eye, EyeOff, Menu, X, Upload } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { api, signInWithGooglePopup } from '../../services/api';
import { Footer } from './Footer';
const logo = "/logo.png";
import { Checkbox } from './ui/checkbox';

interface OnboardingData {
  // Account info
  name: string;
  email: string;
  password: string;
  // Business info
  businessName: string;
  logoFile: File | null;
  logoUrl: string;
  platforms: {
    google: { enabled: boolean; url: string };
    yelp: { enabled: boolean; url: string };
    facebook: { enabled: boolean; url: string };
    tripadvisor: { enabled: boolean; url: string };
    custom: { enabled: boolean; url: string; name: string };
  };
}

export function Onboarding() {
  const navigate = useNavigate();
  const { signUp, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    email: '',
    password: '',
    businessName: '',
    logoFile: null,
    logoUrl: '',
    platforms: {
      google: { enabled: false, url: '' },
      yelp: { enabled: false, url: '' },
      facebook: { enabled: false, url: '' },
      tripadvisor: { enabled: false, url: '' },
      custom: { enabled: false, url: '', name: '' }
    }
  });

  const totalSteps = 4;

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSaving(true);
    try {
      const token = await signInWithGooglePopup();
      api.setToken(token);
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    setError('');
    
    // Step 0: Create account
    if (step === 0) {
      setIsSaving(true);
      try {
        const { error: signUpError, requiresConfirmation } = await signUp(data.email, data.password, data.name);
        if (signUpError) {
          setIsSaving(false);
          setError(signUpError instanceof Error ? signUpError.message : 'Failed to create account. Please try again.');
          return;
        }
        setIsSaving(false);
        if (requiresConfirmation) {
          navigate('/verify-email', { state: { email: data.email } });
          return;
        }
        setStep(step + 1);
      } catch (err: any) {
        setIsSaving(false);
        setError(err.message || 'Failed to create account. Please try again.');
      }
      return;
    }
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding - save business to API
      setIsSaving(true);
      
      const reviewPlatforms = Object.entries(data.platforms)
        .filter(([_, platform]) => platform.enabled && platform.url)
        .map(([key, platform]) => ({
          name: key === 'google' ? 'Google Reviews' : 
                key === 'yelp' ? 'Yelp' :
                key === 'facebook' ? 'Facebook' :
                key === 'tripadvisor' ? 'TripAdvisor' :
                platform.name,
          url: platform.url,
          icon: key as 'google' | 'yelp' | 'facebook' | 'tripadvisor' | 'custom'
        }));

      const businessId = `business-${Date.now()}`; // Generate unique ID
      
      try {
        await api.createBusiness({
          id: businessId,
          name: data.businessName,
          logoUrl: data.logoUrl || undefined,
          reviewPlatforms
        });
        setIsSaving(false);
        navigate('/dashboard');
      } catch (err: any) {
        setIsSaving(false);
        setError(err.message || 'Failed to create business. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setError('');
    }
  };

  const canProceed = () => {
    if (step === 0) {
      // Validate account creation fields
      return data.name.trim().length > 0 && 
             data.email.trim().length > 0 && 
             data.email.includes('@') &&
             data.password.length >= 6;
    }
    if (step === 1) return data.businessName.trim().length > 0;
    if (step === 2) return true; // Logo is optional
    if (step === 3) {
      // At least one platform must be enabled with a URL
      // Custom platform must have both name and URL
      const standardPlatforms = Object.entries(data.platforms)
        .filter(([key]) => key !== 'custom')
        .some(([_, p]) => p.enabled && p.url.trim().length > 0);
      
      const customPlatform = data.platforms.custom.enabled && 
        data.platforms.custom.url.trim().length > 0 && 
        data.platforms.custom.name.trim().length > 0;
      
      return standardPlatforms || customPlatform;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center md:justify-start">
              <Link to="/">
                <img 
                  src={logo} 
                  alt="Feedback Page" 
                  className="h-16 md:h-20 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 md:gap-3">
              <Link
                to="/"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                How It Works
              </Link>
              <Link
                to="/features"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Pricing
              </Link>
              <Link
                to="/login"
                className="text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg absolute right-4"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8 md:mb-12 flex justify-center">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all ${
                      s < step + 1
                        ? 'bg-black border-black'
                        : s === step + 1
                        ? 'border-black bg-white text-black'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {s < step + 1 ? (
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    ) : (
                      <span className="text-xs md:text-sm font-semibold">{s}</span>
                    )}
                  </div>
                  {s < totalSteps && (
                    <div
                      className={`w-12 md:w-24 h-0.5 mx-1.5 md:mx-2 ${
                        s < step + 1 ? 'bg-black' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content - No Card */}
          <div className="px-2 md:px-4">
            {step === 0 && <Step0 data={data} setData={setData} onGoogleSignIn={handleGoogleSignIn} error={error} loading={isSaving} />}
            {step === 1 && <Step1 data={data} setData={setData} />}
            {step === 2 && <Step2 data={data} setData={setData} />}
            {step === 3 && <Step3 data={data} setData={setData} />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 hover:text-gray-900 disabled:opacity-0 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed() || isSaving}
                className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-black text-white rounded-lg text-sm md:text-base font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : step === totalSteps - 1 ? 'Complete' : 'Continue'}
                {!isSaving && step < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs md:text-sm text-red-500 mt-3 md:mt-4">{error}</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Step0({ data, setData, onGoogleSignIn, error, loading }: { data: OnboardingData; setData: (data: OnboardingData) => void; onGoogleSignIn: () => Promise<void>; error?: string; loading?: boolean }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 mb-1.5 md:mb-2">
        Create your account
      </h2>
      <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">
        Enter your details to get started
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {/* Google Sign In Button */}
      <button
        onClick={onGoogleSignIn}
        type="button"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-500">Or continue with email</span>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="e.g., John Doe"
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base md:text-lg"
          autoFocus
        />
      </div>

      <div className="mt-3 md:mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="e.g., john.doe@example.com"
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base"
        />
      </div>

      <div className="mt-3 md:mt-4">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="Enter a strong password"
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base"
        />
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Must be at least 6 characters
        </p>
      </div>
    </div>
  );
}

function Step1({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 mb-1.5 md:mb-2">
        What's your business name?
      </h2>
      <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">
        This will be displayed on your feedback page
      </p>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          value={data.businessName}
          onChange={(e) => setData({ ...data, businessName: e.target.value })}
          placeholder="e.g., Sunny Side Cafe"
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base md:text-lg"
          autoFocus
        />
      </div>
    </div>
  );
}

function Step2({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, logoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 mb-1.5 md:mb-2">
        Add your logo
      </h2>
      <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">
        Optional, but helps customers recognize your business
      </p>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-2">
          Logo URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="url"
          id="logoUrl"
          value={data.logoUrl}
          onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base"
        />
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Paste a direct link to your logo image
        </p>

        {data.logoUrl && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-50 rounded-lg">
            <p className="text-xs md:text-sm font-medium text-slate-700 mb-3">Preview:</p>
            <div className="flex justify-center">
              <img
                src={data.logoUrl}
                alt="Logo preview"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-6">
        <label htmlFor="logoFile" className="block text-sm font-medium text-slate-700 mb-2">
          Upload Logo <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="file"
          id="logoFile"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-base"
        />
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Upload a logo file
        </p>

        {data.logoFile && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-50 rounded-lg">
            <p className="text-xs md:text-sm font-medium text-slate-700 mb-3">Preview:</p>
            <div className="flex justify-center">
              <img
                src={data.logoUrl}
                alt="Logo preview"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const platforms = [
    { key: 'google', label: 'Google Reviews', placeholder: 'https://g.page/r/...' },
    { key: 'yelp', label: 'Yelp', placeholder: 'https://www.yelp.com/biz/...' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/...' },
    { key: 'tripadvisor', label: 'TripAdvisor', placeholder: 'https://www.tripadvisor.com/...' }
  ];

  const togglePlatform = (key: string) => {
    setData({
      ...data,
      platforms: {
        ...data.platforms,
        [key]: {
          ...data.platforms[key as keyof typeof data.platforms],
          enabled: !data.platforms[key as keyof typeof data.platforms].enabled
        }
      }
    });
  };

  const updateUrl = (key: string, url: string) => {
    setData({
      ...data,
      platforms: {
        ...data.platforms,
        [key]: {
          ...data.platforms[key as keyof typeof data.platforms],
          url
        }
      }
    });
  };

  const updateCustomName = (name: string) => {
    setData({
      ...data,
      platforms: {
        ...data.platforms,
        custom: {
          ...data.platforms.custom,
          name
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 mb-1.5 md:mb-2">
        Where should happy customers leave reviews?
      </h2>
      <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">
        Select at least one platform and add the review link
      </p>

      <div className="space-y-3 md:space-y-4">
        {platforms.map(({ key, label, placeholder }) => {
          const platform = data.platforms[key as keyof typeof data.platforms];
          return (
            <div key={key} className="border border-slate-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                <Checkbox
                  id={key}
                  checked={platform.enabled}
                  onChange={() => togglePlatform(key)}
                />
                <label htmlFor={key} className="text-sm md:text-base font-medium text-slate-900 cursor-pointer">
                  {label}
                </label>
              </div>
              {platform.enabled && (
                <input
                  type="url"
                  value={platform.url}
                  onChange={(e) => updateUrl(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-sm"
                />
              )}
            </div>
          );
        })}

        <div className="border border-slate-200 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-3">
            <Checkbox
              id="custom"
              checked={data.platforms.custom.enabled}
              onChange={() => togglePlatform('custom')}
            />
            <label htmlFor="custom" className="text-sm md:text-base font-medium text-slate-900 cursor-pointer">
              Custom Platform
            </label>
          </div>
          {data.platforms.custom.enabled && (
            <>
              <input
                type="text"
                value={data.platforms.custom.name}
                onChange={(e) => updateCustomName(e.target.value)}
                placeholder="Platform Name"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-sm mb-2.5 md:mb-3"
              />
              <input
                type="url"
                value={data.platforms.custom.url}
                onChange={(e) => updateUrl('custom', e.target.value)}
                placeholder="https://example.com/reviews"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-colors outline-none text-sm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}