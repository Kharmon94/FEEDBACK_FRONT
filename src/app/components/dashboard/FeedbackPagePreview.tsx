import { useState } from 'react';
import { Star } from 'lucide-react';
const logo = "/logo.png";

interface FeedbackPagePreviewProps {
  locationName: string;
  locationAddress: string;
  logoUrl?: string | null;
  customMessage?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function FeedbackPagePreview({
  locationName,
  locationAddress,
  logoUrl,
  customMessage,
  colorScheme = {
    primary: '#1e293b', // slate-900
    secondary: '#f8fafc', // slate-50
    accent: '#fbbf24' // yellow-400
  }
}: FeedbackPagePreviewProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src={logoUrl || logo}
            alt="Logo"
            className="h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-1 px-4">
            How was your experience at {locationName}?
          </h1>
          <p className="text-sm text-slate-600 px-4">
            {locationAddress}
          </p>
          {customMessage && (
            <p className="text-sm text-slate-700 mt-3 px-4 italic">
              {customMessage}
            </p>
          )}
        </div>

        {/* Rating Card */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
          style={{
            backgroundColor: colorScheme.secondary
          }}
        >
          <p
            className="text-center text-sm text-slate-700 mb-4"
            style={{
              color: colorScheme.primary
            }}
          >
            Please rate your experience:
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= hoveredRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                  style={{
                    color: star <= hoveredRating ? colorScheme.accent : undefined,
                    fill: star <= hoveredRating ? colorScheme.accent : undefined
                  }}
                />
              </button>
            ))}
          </div>

          {/* Rating Labels */}
          <div className="flex justify-between text-xs text-slate-500 px-2">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}