import { useNavigate } from 'react-router';
import { Clock, CreditCard, X } from 'lucide-react';
import { useState } from 'react';

interface TrialBannerProps {
  daysRemaining: number;
}

export function TrialBanner({ daysRemaining }: TrialBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isUrgent = daysRemaining <= 7;

  return (
    <div className={`rounded-xl border-2 p-4 md:p-6 mb-6 ${
      isUrgent 
        ? 'bg-red-50 border-red-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          isUrgent 
            ? 'bg-red-100' 
            : 'bg-blue-100'
        }`}>
          <Clock className={`w-6 h-6 ${
            isUrgent 
              ? 'text-red-600' 
              : 'text-blue-600'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 ${
            isUrgent 
              ? 'text-red-900' 
              : 'text-blue-900'
          }`}>
            {daysRemaining === 0 
              ? 'Trial ends today!' 
              : daysRemaining === 1 
                ? '1 day left in your free trial' 
                : `${daysRemaining} days left in your free trial`
            }
          </h3>
          <p className={`text-sm mb-4 ${
            isUrgent 
              ? 'text-red-800' 
              : 'text-blue-800'
          }`}>
            Add your payment method now to ensure uninterrupted access to all your feedback and features.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/dashboard/plans')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isUrgent
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Add Payment Method
            </button>
            
            <button
              onClick={() => navigate('/dashboard?tab=billing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isUrgent
                  ? 'bg-white text-red-700 border border-red-300 hover:bg-red-50'
                  : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
              }`}
            >
              View Plans
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            isUrgent
              ? 'text-red-600 hover:bg-red-100'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}