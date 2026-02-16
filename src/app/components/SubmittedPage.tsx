import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
const logo = "/logo.png";
import { api } from '../api/client';
import { Business } from '../types';

export function SubmittedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [business, setBusiness] = useState<Business | null>(null);
  
  // Determine type based on the route
  const type = location.pathname.includes('suggestion') ? 'suggestion' : 'feedback';

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      await api.initDemo();
      const businessId = 'demo-business';
      const businessData = await api.getBusiness(businessId);
      setBusiness(businessData);
    } catch (error) {
      console.error('Failed to load business:', error);
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
              src={logo} 
              alt="Feedback Page" 
              className="h-16 md:h-20 mx-auto mb-6 hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-semibold text-black mb-3 tracking-tight">
            {type === 'feedback' ? 'Thank you for your feedback' : 'Thanks for your suggestion!'}
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            {type === 'feedback' 
              ? `Your feedback has been received by ${business.name}. We take all feedback seriously and will work to improve.`
              : `Your suggestion has been received by ${business.name}. We appreciate you taking the time to help us improve!`
            }
          </p>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-black text-white py-3.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}