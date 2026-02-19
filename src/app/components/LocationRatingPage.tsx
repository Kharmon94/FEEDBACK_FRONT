import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Star, Lightbulb } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';

export function LocationRatingPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const loadLocation = async () => {
      if (!locationId) {
        navigate('/');
        return;
      }

      try {
        const data = await api.getLocation(locationId);
        setLocation(data);
      } catch (error) {
        console.error('Failed to load location:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [locationId, navigate]);

  useEffect(() => {
    if (rating > 0 && locationId) {
      const timer = setTimeout(async () => {
        const search = `?locationId=${encodeURIComponent(locationId)}&rating=${rating}`;
        if (rating >= 4) {
          // Submit 4-5 star feedback to backend before redirecting
          try {
            await api.submitFeedback({
              businessId: locationId,
              rating,
              comment,
              type: 'feedback'
            });
          } catch (err) {
            console.error('Failed to save feedback:', err);
          }
          const platforms = (location?.reviewPlatforms || []).filter((p: { url?: string }) => p?.url);
          if (platforms.length >= 1) {
            window.location.href = platforms[0].url;
            return;
          }
          navigate(`/thank-you${search}`, {
            state: {
              rating,
              comment,
              locationId,
              locationName: location?.name,
              logoUrl: location?.logoUrl,
              reviewPlatforms: location?.reviewPlatforms || []
            }
          });
        } else {
          navigate(`/feedback${search}${comment ? `&comment=${encodeURIComponent(comment)}` : ''}`, {
            state: {
              rating,
              comment,
              locationId,
              locationName: location?.name,
              logoUrl: location?.logoUrl
            }
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [rating, comment, navigate, location, locationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Location not found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Go to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8 md:mb-12">
          <Link to="/" className="inline-block">
            <img 
              src={location.logoUrl || logo} 
              alt={location.name} 
              className="h-20 md:h-28 mx-auto mb-3 md:mb-4 hover:opacity-80 transition-opacity object-contain"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 md:mb-3 px-4">
            How was your experience at {location.name}?
          </h1>
          <p className="text-base md:text-lg text-slate-600 px-4">
            {location.address}
          </p>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8 lg:p-12">
          <p className="text-center text-base md:text-lg text-slate-700 mb-6 md:mb-8 px-4">
            Please rate your experience:
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-12 h-12 md:w-16 md:h-16 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment Text Box */}
          <div className="mb-8 md:mb-10">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience... (optional)"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-2">
              This helps us understand your experience better
            </p>
          </div>

          {/* Rating Labels */}
          <div className="flex justify-between text-xs md:text-sm text-slate-500 mb-8 md:mb-10 px-2 md:px-4">
            <span>Poor</span>
            <span>Excellent</span>
          </div>

          {/* Suggestion Button */}
          <div className="text-center pt-6 md:pt-8 border-t border-slate-200">
            <button
              onClick={() => navigate('/suggestion', { state: { locationId } })}
              className="inline-flex items-center gap-2 text-sm md:text-base text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 group-hover:text-yellow-500 transition-colors" />
              <span>Have a suggestion instead?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}