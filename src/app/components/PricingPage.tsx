import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Check, Zap, Crown, Building2, Menu, X } from 'lucide-react';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { api, type Plan } from '../../services/api';
const logo = "/logo.png";

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansError, setPlansError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getPlans();
        // Keep the pricing page focused on paid plans + enterprise (exclude free).
        const items = data.plans
          .filter((p) => p.slug !== 'free')
          .sort((a, b) => a.display_order - b.display_order);
        if (!cancelled) setPlans(items);
      } catch (e) {
        if (!cancelled) setPlansError(e instanceof Error ? e.message : 'Failed to load plans');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectPlan = async (planId: string) => {
    // Handle enterprise plan
    if (planId === 'enterprise') {
      navigate('/contact-us');
      return;
    }

    // Handle paid plans - redirect to login/onboarding if not logged in
    if (!user) {
      navigate('/onboarding');
      return;
    }

    // If logged in, proceed with checkout
    setLoading(planId);
    try {
      // This would create a Stripe checkout session in production
      // For now, just navigate to dashboard
      setTimeout(() => {
        setLoading(null);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error selecting plan:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SEO
        title="Pricing Plans - Choose Your Perfect Plan"
        description="Flexible pricing for businesses of all sizes. Start with 1 location or scale to unlimited. Save with yearly billing. Free trial available."
        keywords="feedback pricing, review management pricing, business plans, subscription plans"
        canonical="https://feedback-page.com/pricing"
      />

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center md:justify-start">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src={logo} 
                  alt="Feedback Page" 
                  className="h-16 md:h-20"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 md:gap-3">
              <Link
                to="/"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                How It Works
              </Link>
              <Link
                to="/features"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-xs md:text-sm font-medium text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2 border-b-2 border-slate-900"
              >
                Pricing
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg absolute right-4"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg transition-colors"
                >
                  Pricing
                </Link>
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Choose the plan that's right for your business
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-white border border-slate-200 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
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

        {plansError && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center">
            {plansError}
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.slug === 'starter' ? Zap : plan.slug === 'pro' ? Crown : Building2;
            const cents = billingPeriod === 'monthly' ? plan.monthly_price_cents : plan.yearly_price_cents;
            const price = cents == null ? null : Math.round(cents / 100);

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border-2 p-8 relative ${
                  plan.highlighted
                    ? 'border-blue-500 shadow-xl scale-105'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.highlighted ? 'text-white' : 'text-slate-700'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl text-slate-900">{plan.name}</h3>
                  </div>
                </div>

                

                <div className="mb-6">
                  {price !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">${price}</span>
                        <span className="text-slate-600">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingPeriod === 'yearly' && price > 0 && (
                        null
                      )}
                    </>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">Custom</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.slug)}
                  disabled={loading === plan.slug}
                  className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                    plan.highlighted
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.slug ? 'Loading...' : (plan.cta || (plan.slug === 'enterprise' ? 'Contact Sales' : 'Select Plan'))}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-600">
            All plans include a 30-day free trial. No credit card required.{' '}
            <Link to="/help" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn more
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}