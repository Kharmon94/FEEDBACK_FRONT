import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { api, type Plan } from '../../../services/api';

export function BillingPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showFeatures, setShowFeatures] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const currentPlanSlug = user?.plan || 'free';
  const currentPlan = useMemo(() => plans.find((p) => p.slug === currentPlanSlug) || null, [plans, currentPlanSlug]);

  const priceDollars = useMemo(() => {
    if (!currentPlan) return null;
    const cents = billingPeriod === 'monthly' ? currentPlan.monthly_price_cents : currentPlan.yearly_price_cents;
    return cents == null ? null : Math.round(cents / 100);
  }, [currentPlan, billingPeriod]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getPlans();
        if (!cancelled) setPlans(data.plans);
      } catch {
        // Keep UI resilient; no hard fail required here.
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-black text-center">Billing & Plan</h2>

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Current Plan</div>
            <h3 className="text-2xl font-bold text-black">{currentPlan?.name || (plansLoading ? 'Loading…' : 'Free')}</h3>
          </div>
          <div className="text-left sm:text-right">
            {priceDollars != null ? (
              <>
                <div className="text-3xl font-bold text-black">${priceDollars}</div>
                <div className="text-sm text-gray-600">
                  {billingPeriod === 'yearly' ? 'per year' : 'per month'}
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
              {(currentPlan?.features || []).map((feature, index) => (
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