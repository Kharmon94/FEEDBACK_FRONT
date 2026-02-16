import { Link } from 'react-router';
import { Star, MessageSquare, BarChart3, Download, Smartphone, Settings, Shield, Zap, Users, Globe, CheckCircle, TrendingUp, Menu, X } from 'lucide-react';
import { Footer } from './Footer';
import { SEO } from './SEO';
const logo = "/logo.png";
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Beautiful, responsive feedback pages that work perfectly on any device. Your customers can leave feedback seamlessly from their phones.'
  },
  {
    icon: Settings,
    title: 'Custom Branding',
    description: 'Add your business logo and customize your feedback page to match your brand. Build trust and recognition with every interaction.'
  },
  {
    icon: Globe,
    title: 'Multiple Review Platforms',
    description: 'Connect to Google Reviews, Yelp, Facebook, and more. Direct happy customers to your preferred review platforms automatically.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your average rating, view all feedback in one place, and identify trends to improve your business over time.'
  },
  {
    icon: Download,
    title: 'CSV Export',
    description: 'Download all your feedback data as CSV files for deeper analysis, reporting, or integration with other business tools.'
  },
  {
    icon: MessageSquare,
    title: 'Suggestion Box',
    description: 'Let happy customers share ideas for improvement too. Collect valuable suggestions from your most satisfied customers.'
  },
  {
    icon: Star,
    title: 'Smart Rating Logic',
    description: 'Automatically route customers based on their rating. Low ratings go to private feedback, high ratings to public reviews.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Keep negative feedback private and handle it internally. Protect your online reputation while addressing customer concerns.'
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Get your feedback page up and running in under 2 minutes. No technical knowledge required, just simple configuration.'
  },
  {
    icon: Users,
    title: 'Multi-Location Support',
    description: 'Manage feedback for multiple business locations from a single dashboard. Perfect for franchises and chains.'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Updates',
    description: 'See new feedback as it arrives. Stay on top of customer sentiment and respond quickly to any issues.'
  },
  {
    icon: CheckCircle,
    title: 'No Credit Card Required',
    description: 'Start with our free plan and upgrade when you\'re ready. Experience all the features with no commitment.'
  }
];

export function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SEO
        title="Features - Everything You Need to Manage Customer Feedback"
        description="Mobile-first design, custom branding, multi-platform integration, analytics dashboard, CSV exports, and more. Everything you need to manage customer feedback."
        keywords="feedback features, review management tools, customer feedback software, analytics dashboard"
        canonical="https://feedback-page.com/features"
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
              <Link to="/">
                <img 
                  src={logo} 
                  alt="Feedback Page" 
                  className="h-16 md:h-20 cursor-pointer hover:opacity-80 transition-opacity"
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
                className="text-xs md:text-sm font-medium text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2 border-b-2 border-slate-900"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Pricing
              </Link>
              <Link
                to="/login"
                className="text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 absolute right-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
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
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-4 md:mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Protect Your Reputation
            </span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 mb-8">
            Powerful features designed to help you capture private feedback, boost positive reviews, 
            and build a better business.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join businesses that are protecting their reputation and improving customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="px-8 py-4 text-lg font-semibold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-xl inline-block"
            >
              Start 30-Day Free Trial
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-colors inline-block"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}