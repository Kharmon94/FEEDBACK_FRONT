import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, User, Mail, Phone, CheckCircle2, Info } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { Checkbox } from './ui/checkbox';

export function OptInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { locationId?: string; locationName?: string; rating?: number } | null;
  const locationId = state?.locationId ?? '';
  const rating = state?.rating;
  const hasLocation = !!locationId;
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* Success Message */}
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-xl text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8 sm:mb-10">
              <img src={logo} alt="Logo" className="h-20 sm:h-24" />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-black mb-3 tracking-tight">
              You're all set!
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Thank you for joining our newsletter and rewards program. We'll keep you updated with exclusive offers!
            </p>

            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-4 rounded-xl font-medium text-base hover:bg-gray-900 transition-all shadow-sm"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <img src={logo} alt="Logo" className="h-20 sm:h-24" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-black mb-3 text-center tracking-tight">
            Join Our Newsletter & Rewards Program
          </h1>
          
          <p className="text-sm text-gray-600 mb-4 text-center">
            Get exclusive offers, early access to new features, and earn rewards for your loyalty!
          </p>

          {!hasLocation && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Please use the link from your thank-you page to join our newsletter and rewards program.
              </p>
            </div>
          )}

          {/* Opt-In Form */}
          <div className="space-y-6">
            {/* Checkbox */}
            <Checkbox
              id="opt-in-checkbox"
              checked={optInChecked}
              onChange={setOptInChecked}
              label="I agree to receive promotional emails, SMS messages, and exclusive offers. I understand I can unsubscribe at any time."
            />

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={optInName}
                  onChange={(e) => setOptInName(e.target.value)}
                  placeholder="John Doe"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={optInEmail}
                  onChange={(e) => setOptInEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={optInPhone}
                  onChange={(e) => setOptInPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  disabled={!optInChecked || !hasLocation}
                  className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleOptInSubmit}
              disabled={!optInChecked || !hasLocation || submitting}
              className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? 'Joining...' : 'Join Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}