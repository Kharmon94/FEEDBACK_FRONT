import { useNavigate } from 'react-router';
import { CreditCard, AlertCircle } from 'lucide-react';

export function TrialExpiredPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
            <AlertCircle className="w-10 h-10 text-slate-700" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Your free trial has ended
          </h1>
          
          {/* Description */}
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            To continue using Feedback Page and accessing all your valuable customer feedback, 
            please add a payment method and choose a plan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard/plans')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Add Payment Method
            </button>
            
            <button
              onClick={() => navigate('/contact-us')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              Contact Support
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Have questions? We're here to help!{' '}
              <a 
                href="mailto:support@feedback-page.com" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@feedback-page.com
              </a>
            </p>
          </div>
        </div>

        {/* Benefits Reminder */}
        <div className="mt-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">
            What you'll keep with a paid plan:
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>All your existing feedback and customer data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Advanced analytics and insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>CSV export functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Priority customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
