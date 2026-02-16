import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Star, ArrowLeft, Store } from 'lucide-react';
import { api } from '../api/client';

export function RatingPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [business, setBusiness] = useState<{ logoUrl?: string; name?: string }>({});

  // Initialize demo data when component mounts
  useEffect(() => {
    const initializeDemo = async () => {
      try {
        await api.initDemo();
        console.log('Demo initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        console.log('Demo initialization skipped - continuing with UI');
        // Continue anyway - don't block the UI
        setIsInitialized(true);
      }
    };
    
    // Initialize immediately - no timeout needed
    initializeDemo();
  }, []); // Only run once on mount

  useEffect(() => {
    console.log('Rating selected:', rating);
  }, [rating]);

  const handleSubmit = () => {
    console.log('=== SUBMIT CLICKED ===');
    console.log('isInitialized:', isInitialized);
    console.log('rating:', rating);
    
    if (!isInitialized || rating === 0) {
      console.log('Blocked: isInitialized =', isInitialized, ', rating =', rating);
      return;
    }

    console.log('Submitting rating:', rating, 'comment:', comment);

    if (rating >= 1 && rating <= 3) {
      console.log('LOW RATING - Navigating to feedback form');
      // Use URL params as backup
      const params = new URLSearchParams();
      params.set('rating', rating.toString());
      if (comment) params.set('comment', comment);
      
      navigate(`/feedback?${params.toString()}`, { 
        replace: false,
        state: { rating, comment } 
      });
    } else if (rating >= 4 && rating <= 5) {
      console.log('HIGH RATING - Navigating to thank you page');
      // Use URL params as backup
      const params = new URLSearchParams();
      params.set('rating', rating.toString());
      if (comment) params.set('comment', comment);
      
      navigate(`/thank-you?${params.toString()}`, { 
        replace: false,
        state: { rating, comment } 
      });
    } else {
      console.log('Invalid rating:', rating);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Back to Home Button - Fixed to top-left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back to Home</span>
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-3">
            {business?.name || 'Your Business'}
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-base sm:text-lg mb-10 sm:mb-12">
            How was your experience?
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all ${
                    star <= (hoveredRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Comment Text Box */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience... (optional)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            />
            
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !isInitialized}
            className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-medium text-base sm:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black shadow-sm"
          >
            {rating === 0 ? 'Select a rating to continue' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}