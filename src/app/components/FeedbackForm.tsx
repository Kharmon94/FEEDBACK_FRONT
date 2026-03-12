import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { Star, Upload, X, ArrowLeft, Lightbulb } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { trackFeedbackEvent } from '../../services/api';
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
  const [business, setBusiness] = useState<{ logoUrl?: string; name?: string; publicId?: string }>(() => ({
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
        setBusiness({ logoUrl: loc.logoUrl, name: loc.name, publicId: loc.publicId });
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
    trackFeedbackEvent(locationId, 'feedback_submit', rating);

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
      const idForUrl = business?.publicId || locationId;
      navigate(`/feedback-submitted?locationId=${encodeURIComponent(idForUrl)}`, {
        state: {
          locationId: idForUrl,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Back Button - Fixed to top-left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button
          onClick={() => ((business?.publicId || locationId) ? navigate(`/l/${business?.publicId || locationId}`) : navigate(-1))}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <img 
              src={business?.logoUrl || logo} 
              alt={business?.name || 'Business'} 
              className="h-20 md:h-24 max-w-[200px] max-h-[200px] w-auto mx-auto object-contain"
            />
          </div>

          {/* Business Name */}
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center mb-6 md:mb-8">
            {business?.name || 'Your Business'}
          </h1>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Main Question */}
            <div>
              <label className="block text-base font-medium text-slate-900 mb-3">
                What could we have done better?
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none placeholder:text-slate-400 transition-all"
                rows={5}
                placeholder="Please share your feedback so we can improve..."
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400 transition-all"
                placeholder="Your phone number"
              />
            </div>

            {/* Contact Me Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                id="contact-me"
                checked={contactMe}
                onCheckedChange={(checked) => setContactMe(!!checked)}
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                I would like to be contacted regarding this feedback so we can resolve this issue
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !comment.trim() || !locationId}
              className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black shadow-sm mt-6"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>

            {/* Suggestion Link */}
            {locationId && (
              <div className="text-center pt-6 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => navigate(`/l/${business?.publicId || locationId}/suggestions`)}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                >
                  <Lightbulb className="w-4 h-4 group-hover:text-yellow-500 transition-colors" />
                  <span>Have a suggestion instead?</span>
                </button>
              </div>
            )}
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}