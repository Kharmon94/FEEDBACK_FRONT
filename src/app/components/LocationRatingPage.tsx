import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Star, Lightbulb } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { trackFeedbackEvent } from '../../services/api';
import { getPageCopy } from '../utils/pageCopy';

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
        trackFeedbackEvent(locationId, 'page_view');
      } catch (error) {
        console.error('Failed to load location:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [locationId, navigate]);

  const publicId = location?.publicId || locationId;

  useEffect(() => {
    if (rating > 0 && locationId) {
      const timer = setTimeout(async () => {
        const idForUrl = publicId || locationId;
        const search = `?locationId=${encodeURIComponent(idForUrl)}&rating=${rating}`;
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
          navigate(`/thank-you${search}`, {
            state: {
              rating,
              comment,
              locationId: idForUrl,
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
              locationId: idForUrl,
              locationName: location?.name,
              logoUrl: location?.logoUrl
            }
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [rating, comment, navigate, location, locationId, publicId]);

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
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-block">
            <img 
              src={location.logoUrl || logo} 
              alt={location.name} 
              className="h-20 md:h-24 max-w-[200px] max-h-[200px] w-auto mx-auto object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 md:mb-3 mt-4 px-4">
            {getPageCopy(location.pageCopy, 'feedback', 'page_title', location.name)}
          </h1>
          <p className="text-base md:text-lg text-slate-600 px-4">
            {location.address}
          </p>
          {location.customMessage && (
            <p className="text-sm text-slate-700 mt-3 px-4 italic">
              {location.customMessage}
            </p>
          )}
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 lg:p-12">
          <p className="text-center text-base md:text-lg text-slate-700 mb-6 md:mb-8 px-4">
            {getPageCopy(location.pageCopy, 'feedback', 'rating_prompt', location.name)}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  trackFeedbackEvent(locationId!, 'star_click', star);
                  setRating(star);
                }}
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
              placeholder={getPageCopy(location.pageCopy, 'feedback', 'comment_placeholder', location.name)}
              rows={4}
              className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-2">
              {getPageCopy(location.pageCopy, 'feedback', 'comment_helper', location.name)}
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
              onClick={() => navigate(`/l/${publicId || locationId}/suggestions`)}
              className="inline-flex items-center gap-2 text-sm md:text-base text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 group-hover:text-yellow-500 transition-colors" />
              <span>{getPageCopy(location.pageCopy, 'feedback', 'suggestion_link', location.name)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}