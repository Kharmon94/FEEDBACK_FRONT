import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Sparkles, User, Mail, MessageSquare, ArrowRight } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { Business } from '../types';

export function SuggestionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationIdFromState = (location.state as { locationId?: string })?.locationId;
  const [business, setBusiness] = useState<Business | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (locationIdFromState) {
      api.getLocation(locationIdFromState).then((loc) => {
        setBusiness({ name: loc.name, logoUrl: loc.logoUrl } as Business);
      }).catch(() => {
        setBusiness({ name: 'Feedback Page', logoUrl: undefined } as Business);
      });
    } else {
      // Standalone visit: use fallback (getBusiness requires auth)
      setBusiness({ name: 'Feedback Page', logoUrl: undefined } as Business);
    }
  }, [locationIdFromState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const businessId = locationIdFromState || '';
      
      await api.submitFeedback({
        businessId,
        rating: 0,
        name: formData.name || undefined,
        email: formData.email || undefined,
        comment: formData.suggestion,
        type: 'suggestion'
      });

      navigate('/suggestion-submitted', { state: { locationId: businessId || undefined, locationName: business?.name, logoUrl: business?.logoUrl } });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8 md:mb-10">
          <Link to="/" className="inline-block">
            <img 
              src={business?.logoUrl || logo} 
              alt={business?.name || 'Feedback Page'} 
              className="h-16 md:h-20 mx-auto mb-6 hover:opacity-80 transition-opacity object-contain"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-black mb-2 tracking-tight">
            Share your ideas
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            We'd love to hear your suggestions for {business.name}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="suggestion" className="block text-sm font-medium text-black mb-2">
                Your suggestion <span className="text-black">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <textarea
                  id="suggestion"
                  required
                  value={formData.suggestion}
                  onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                  rows={5}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
                  placeholder="I think it would be great if..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                Your name (optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Your email (optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.suggestion.trim()}
              className="w-full bg-black text-white py-3.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit suggestion
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Your suggestion will be reviewed by the {business.name} team
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            ← Back to rating
          </button>
        </div>
      </div>
    </div>
  );
}