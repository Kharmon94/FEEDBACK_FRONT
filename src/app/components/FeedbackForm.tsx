import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { Star, Upload, X, ArrowLeft, Store } from 'lucide-react';
import { api } from '../api/client';
import { Checkbox } from './ui/checkbox';

export function FeedbackForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const stateRating = location.state?.rating || 0;
  const stateComment = location.state?.comment || '';
  const stateLocationId = location.state?.locationId;
  const stateLocationName = location.state?.locationName;
  const stateLogoUrl = location.state?.logoUrl;
  const urlRating = Number(searchParams.get('rating')) || 0;
  const urlComment = searchParams.get('comment') || '';
  const urlLocationId = searchParams.get('locationId') || '';
  const localStorageRating = parseInt(localStorage.getItem('feedbackRating') || '0');
  const rating = stateRating || urlRating || localStorageRating;
  const initialComment = stateComment || urlComment || '';
  const locationId = stateLocationId || urlLocationId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState(initialComment);
  const [contactMe, setContactMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [business, setBusiness] = useState<{ logoUrl?: string; name?: string }>(() => ({
    logoUrl: stateLogoUrl,
    name: stateLocationName
  }));

  useEffect(() => {
    if (!rating || rating === 0) {
      navigate('/');
    }
  }, [rating, navigate]);

  useEffect(() => {
    if (locationId && !stateLocationName && !stateLogoUrl) {
      api.getLocation(locationId).then((loc) => {
        setBusiness({ logoUrl: loc.logoUrl, name: loc.name });
      }).catch(() => {});
    }
  }, [locationId, stateLocationName, stateLogoUrl]);

  if (!rating) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) {
      alert('Unable to submit: location context was lost. Please go back and try again.');
      return;
    }
    setSubmitting(true);

    try {
      await api.submitFeedback({
        businessId: locationId,
        rating,
        name: name || undefined,
        email: email || undefined,
        phone: contactMe ? phone : undefined,
        contactMe: contactMe || undefined,
        comment,
        type: 'feedback'
      });

      localStorage.removeItem('feedbackRating');
      localStorage.removeItem('feedbackComment');
      localStorage.removeItem('feedbackImages');

      const locationName = business?.name || stateLocationName;
      navigate(`/feedback-submitted?locationId=${encodeURIComponent(locationId)}`, {
        state: {
          locationId,
          locationName,
          logoUrl: business?.logoUrl || stateLogoUrl
        }
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Back Button - Fixed to top-left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6 mt-4">
            {business?.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.name} 
                className="max-w-[200px] max-h-[200px] w-auto h-auto object-contain"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <Store className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Business Name */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-8">
            {business?.name || 'Your Business'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Main Question */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                What could we have done better?
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 resize-none placeholder:text-gray-400 transition-all"
                rows={5}
                placeholder="Please share your feedback so we can improve..."
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                placeholder="Your phone number"
              />
            </div>

            {/* Contact Me Checkbox */}
            <Checkbox
              id="contact-me"
              checked={contactMe}
              onChange={setContactMe}
              label="I would like to be contacted to resolve this issue"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !comment.trim() || !locationId}
              className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black shadow-sm mt-6"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}