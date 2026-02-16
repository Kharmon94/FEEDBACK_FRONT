import { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, Zap, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Plan {
  id: string;
  name: string;
  price: number | null;
  billingPeriod: 'monthly' | 'yearly';
  locations: number | null;
  features: string[];
}

interface PlanOption {
  id: string;
  name: string;
  icon: any;
  price: { monthly: number | null; yearly: number | null };
  locations: number | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export function BillingPanel() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showFeatures, setShowFeatures] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>({
    id: 'starter',
    name: 'Starter',
    price: 29,
    billingPeriod: 'monthly',
    locations: 1,
    features: [
      '1 location',
      'Unlimited feedback submissions',
      'Advanced analytics',
      'Priority email support',
      'Custom branding',
      'Email notifications',
      'CSV export',
    ]
  });

  const plans: PlanOption[] = [
    {
      id: 'starter',
      name: 'Starter',
      icon: Check,
      price: { monthly: 29, yearly: 297 },
      locations: 1,
      description: 'Perfect for single location businesses',
      features: [
        '1 location',
        'Unlimited feedback submissions',
        'Advanced analytics',
        'Priority email support',
        'Custom branding',
        'Email notifications',
        'CSV export',
      ],
      cta: 'Upgrade Plan',
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      price: { monthly: 59, yearly: 597 },
      locations: 5,
      description: 'For growing businesses',
      features: [
        'Up to 5 locations',
        'Unlimited feedback submissions',
        'Advanced analytics & reporting',
        'Priority email support',
        'Custom branding',
        'Email notifications',
        'API access',
        'Location management dashboard',
      ],
      cta: 'Upgrade Plan',
      highlighted: true,
    },
    {
      id: 'business',
      name: 'Business',
      icon: Crown,
      price: { monthly: 99, yearly: 997 },
      locations: 15,
      description: 'For multi-location businesses',
      features: [
        'Up to 15 locations',
        'Unlimited feedback submissions',
        'Advanced analytics & reporting',
        'Priority email & phone support',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security features',
      ],
      cta: 'Upgrade Plan',
      highlighted: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      price: { monthly: null, yearly: null },
      locations: null,
      description: 'For large organizations',
      features: [
        'Unlimited locations',
        'Unlimited feedback submissions',
        'Custom analytics & reporting',
        '24/7 priority support',
        'White-label solution',
        'Custom integrations',
        'Dedicated success team',
        'SLA guarantee',
        'Custom contracts',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const currentPlanInfo = plans.find(p => p.id === currentPlan.id);
  const Icon = currentPlanInfo?.icon || Check;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-black text-center">Billing & Plan</h2>

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Current Plan</div>
            <h3 className="text-2xl font-bold text-black">{currentPlan.name}</h3>
          </div>
          <div className="text-left sm:text-right">
            {currentPlan.price ? (
              <>
                <div className="text-3xl font-bold text-black">${currentPlan.price}</div>
                <div className="text-sm text-gray-600">
                  {currentPlan.billingPeriod === 'yearly' ? 'per year' : 'per month'}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-black">Custom</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <button 
            onClick={() => navigate('/dashboard/plans')}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Upgrade Plan
          </button>
          <button 
            onClick={() => navigate('/dashboard/cancel-plan')}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Cancel Plan
          </button>
        </div>

        {/* Features Dropdown Toggle */}
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-black">View Plan Features</span>
          {showFeatures ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Features List */}
        {showFeatures && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-black mb-4">Payment Method</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-black">•••• •••• •••• 4242</div>
              <div className="text-sm text-gray-600">Expires 12/2025</div>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-black mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Feb 1, 2026', amount: 29, status: 'Paid' },
            { date: 'Jan 1, 2026', amount: 29, status: 'Paid' },
            { date: 'Dec 1, 2025', amount: 29, status: 'Paid' },
          ].map((invoice, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-black font-medium">{invoice.date}</div>
                <span className="px-2 py-1 text-xs font-medium bg-black text-white rounded">
                  {invoice.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold text-black">${invoice.amount}.00</div>
                <button className="text-sm font-medium text-black hover:underline">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}