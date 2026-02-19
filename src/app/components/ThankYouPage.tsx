import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router';
import { Star, ExternalLink, CheckCircle2, ArrowLeft, Gift, Copy, Check } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';

export function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const rating = location.state?.rating || Number(searchParams.get('rating')) || 0;
  const comment = location.state?.comment || searchParams.get('comment') || '';
  const images = location.state?.images || [];
  const stateReviewPlatforms = location.state?.reviewPlatforms || [];
  const stateLocationName = location.state?.locationName;
  const stateLogoUrl = location.state?.logoUrl;
  const stateLocationId = location.state?.locationId;
  const urlLocationId = searchParams.get('locationId') || '';
  const locationId = stateLocationId || urlLocationId;

  const [business, setBusiness] = useState<{
    logoUrl?: string;
    name?: string;
    reviewPlatforms?: Array<{ name: string; url: string }>;
  } | null>(() => {
    if (stateReviewPlatforms.length > 0 || stateLocationName || stateLogoUrl) {
      return {
        logoUrl: stateLogoUrl,
        name: stateLocationName,
        reviewPlatforms: stateReviewPlatforms
      };
    }
    return null;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!business && locationId) {
      api.getLocation(locationId).then((loc) => {
        setBusiness({
          logoUrl: loc.logoUrl,
          name: loc.name,
          reviewPlatforms: loc.reviewPlatforms || []
        });
      }).catch(() => {
        setBusiness({ name: 'Business', reviewPlatforms: [] });
      });
    } else if (!business && !locationId) {
      setBusiness({ name: 'Business', reviewPlatforms: [] });
    }
  }, [locationId, business]);

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyComment = async () => {
    try {
      await navigator.clipboard.writeText(comment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
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
            <img 
              src={business?.logoUrl || logo} 
              alt={business?.name || 'Business'} 
              className="max-w-[200px] max-h-[200px] w-auto h-auto object-contain"
            />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-2 text-center tracking-tight">
            Thank you for your feedback!
          </h1>

          {/* Show images if provided */}
          {images.length > 0 && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Your photos:</p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img: string, index: number) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6 text-center px-2">
            We're thrilled you had a great experience! Would you mind sharing your review on one of these platforms?
          </p>

          {/* Review Platform Links */}
          <div className="space-y-3 mb-6">
            {business?.reviewPlatforms?.map((platform: any, index: number) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-all group"
              >
                <span className="text-sm font-medium text-black">
                  Leave a review on {platform.name}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Copy Your Review Section - Only show if comment exists */}
          {comment && (
            <div className="mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    
                    <p className="text-xs text-gray-500"></p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                  <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {comment}
                  </p>
                </div>

                <button
                  onClick={handleCopyComment}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Review Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Opt-In Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/opt-in', { state: { locationId, locationName: business?.name, rating } })}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-black bg-white rounded-lg hover:bg-black hover:text-white transition-all group"
            >
              <Gift className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-semibold">
                Join Our Newsletter & Rewards Program
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}