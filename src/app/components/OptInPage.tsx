import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams, Link } from 'react-router';
import { ArrowLeft, User, Mail, Phone, CheckCircle2, Info } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { Checkbox } from './ui/checkbox';
import type { Business } from '../types';

export function OptInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ locationId?: string }>();
  const [searchParams] = useSearchParams();
  const state = location.state as { locationId?: string; locationName?: string; rating?: number } | null;
  const locationId = (params.locationId || searchParams.get('locationId') || state?.locationId) ?? '';
  const rating = state?.rating;
  const hasLocation = !!locationId;

  const [business, setBusiness] = useState<Business | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [locationNotFound, setLocationNotFound] = useState(false);

  useEffect(() => {
    if (locationId) {
      api.getLocation(locationId).then((loc) => {
        setBusiness({ name: loc.name, logoUrl: loc.logoUrl } as Business);
        setPublicId(loc.publicId || locationId);
        setLocationNotFound(false);
      }).catch(() => {
        setLocationNotFound(true);
        setBusiness(null);
        setPublicId(null);
      });
    } else {
      setBusiness(null);
      setPublicId(null);
      setLocationNotFound(false);
    }
  }, [locationId]);

  const [optInName, setOptInName] = useState('');
  const [optInEmail, setOptInEmail] = useState('');
  const [optInPhone, setOptInPhone] = useState('');
  const [optInChecked, setOptInChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptInSubmit = async () => {
    if (!optInChecked || submitting || !optInName.trim() || !optInEmail.trim() || !optInPhone.trim() || !locationId) return;
    setSubmitting(true);
    try {
      await api.submitOptIn({
        businessId: locationId,
        name: optInName,
        email: optInEmail,
        phone: optInPhone,
        rating,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit opt-in:', error);
      alert('Failed to submit opt-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (locationNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Location not found</h1>
          <p className="text-slate-600 mb-4">The opt-in page link may be invalid or expired.</p>
          <Link to="/" className="text-blue-600 hover:underline">Go to home</Link>
        </div>
      </div>
    );
  }

  if (!locationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Location required</h1>
          <p className="text-slate-600 mb-4">
            Newsletter sign-up must be done from a business's opt-in page. Use the link provided by the business (e.g. feedback-page.com/l/their-location/opt-in).
          </p>
          <Link to="/" className="text-blue-600 hover:underline">Go to home</Link>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* Success Message */}
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-xl text-center">
            {/* Logo */}
            <div className="text-center mb-6 md:mb-8">
              <img src={logo} alt="Logo" className="h-20 md:h-24 max-w-[200px] max-h-[200px] w-auto mx-auto object-contain" />
            </div>

            {/* Success Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 tracking-tight">
                You're all set!
              </h1>
              <p className="text-sm text-slate-600 mb-8">
                Thank you for joining our newsletter and rewards program. We'll keep you updated with exclusive offers!
              </p>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-slate-800 transition-all shadow-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <button
          onClick={() => navigate((publicId || locationId) ? `/l/${publicId || locationId}` : -1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm font-medium">{locationId ? 'Back to rating' : 'Back'}</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <img src={business?.logoUrl || logo} alt={business?.name || 'Logo'} className="h-20 md:h-24 max-w-[200px] max-h-[200px] w-auto mx-auto object-contain" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center tracking-tight">
            Join Our Newsletter & Rewards Program
          </h1>
          
          <p className="text-sm text-slate-600 mb-4 text-center">
            {business?.name
              ? `Get exclusive offers from ${business.name}, early access to new features, and earn rewards for your loyalty!`
              : 'Get exclusive offers, early access to new features, and earn rewards for your loyalty!'}
          </p>

          {!hasLocation && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Please use the link from your thank-you page to join our newsletter and rewards program.
              </p>
            </div>
          )}

          {/* Opt-In Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                id="opt-in-checkbox"
                checked={optInChecked}
                onCheckedChange={(checked) => setOptInChecked(!!checked)}
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                I agree to receive promotional emails, SMS messages, and exclusive offers. I understand I can unsubscribe at any time.
              </span>
            </label>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={optInName}
                  onChange={(e) => setOptInName(e.target.value)}
                  placeholder="John Doe"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={optInEmail}
                  onChange={(e) => setOptInEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={optInPhone}
                  onChange={(e) => setOptInPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleOptInSubmit}
              disabled={!optInChecked || !hasLocation || submitting}
              className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? 'Joining...' : 'Join Now'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}