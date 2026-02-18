import { useEffect, useMemo, useState } from 'react';
import { Check, Crown, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api, type Plan } from '../../../services/api';

export function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const currentPlanSlug = user?.plan || 'free';
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getPlans();
        const items = data.plans.sort((a, b) => a.display_order - b.display_order);
        if (!cancelled) setPlans(items);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load plans');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const iconFor = useMemo(() => {
    return (slug: string) => (slug === 'free' ? Check : slug === 'starter' ? Check : slug === 'pro' ? Zap : slug === 'business' ? Crown : Building2);
  }, []);

  const descriptionFor = useMemo(() => {
    return (p: Plan) => {
      if (p.location_limit == null) return 'For large organizations';
      if (p.location_limit <= 1) return 'Perfect for single location businesses';
      if (p.location_limit <= 5) return 'For growing businesses';
      return 'For multi-location businesses';
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Plans & Pricing</h2>
        <p className="text-slate-600">Choose the plan that fits your business needs</p>
      </div>

      {/* Billing Period Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Billing Period</h3>
            <p className="text-sm text-slate-600">Get 2 months free with yearly billing</p>
          </div>
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                2 Months Free
              </span>
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-slate-500">Loading plans…</div>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const PlanIcon = iconFor(plan.slug);
          const cents = billingPeriod === 'monthly' ? plan.monthly_price_cents : plan.yearly_price_cents;
          const price = cents == null ? null : Math.round(cents / 100);
          const isCurrentPlan = plan.slug === currentPlanSlug;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 relative transition-all hover:shadow-lg ${
                plan.highlighted
                  ? 'border-blue-500 shadow-lg'
                  : isCurrentPlan
                  ? 'border-slate-900'
                  : 'border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Popular
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Current Plan
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-slate-100'
                  }`}
                >
                  <PlanIcon
                    className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-slate-700'}`}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              </div>

              <p className="text-slate-600 text-sm mb-4">{descriptionFor(plan)}</p>

              <div className="mb-4">
                {price !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">${price}</span>
                      <span className="text-slate-600 text-sm">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-xs text-slate-500 mt-1">
                        ${(price / 12).toFixed(0)}/mo billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-2xl font-bold text-slate-900">Custom</div>
                )}
              </div>

              <button
                onClick={() => {
                  if (plan.slug === 'enterprise') {
                    alert('Contact sales for Enterprise plan');
                  } else {
                    alert(`Upgrading to ${plan.name} plan`);
                  }
                }}
                disabled={isCurrentPlan}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors mb-4 ${
                  isCurrentPlan
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : plan.highlighted
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : (plan.cta || (plan.slug === 'enterprise' ? 'Contact Sales' : 'Select Plan'))}
              </button>

              <div className="pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}