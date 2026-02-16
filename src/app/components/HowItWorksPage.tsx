import { Link, useNavigate } from 'react-router';
import { Star, MessageSquare, ExternalLink, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Footer } from './Footer';
import { SEO } from './SEO';
const logo = "/logo.png";
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function HowItWorksPage() {
  const navigate = useNavigate();
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
        title="How It Works - Feedback Page"
        description="Learn how Feedback Page intelligently captures negative feedback privately while directing happy customers to leave public reviews."
        keywords="how it works, customer feedback process, review management, feedback collection"
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
                className="text-xs md:text-sm font-medium text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2 border-b-2 border-slate-900"
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
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg transition-colors"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl text-slate-900 mb-4 md:mb-6">
            How Feedback Page Works
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            A simple, intelligent system that helps you manage customer feedback and build your online reputation
          </p>
        </div>
      </section>

      {/* The Process - Visual Steps */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 md:space-y-24">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Header - Order 1 on mobile, Order 1 on desktop */}
              <div className="flex-1 order-1 md:order-1 w-full">
                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm font-semibold rounded-full mb-4">
                  Step 1
                </div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4 md:mb-4">
                  Customer Rates Their Experience
                </h3>
              </div>

              {/* Graphic - Order 2 on mobile, Order 2 on desktop */}
              <div className="flex-1 order-2 md:order-2 w-full">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-12 h-12 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-slate-600 text-sm">How was your experience?</p>
                </div>
              </div>

              {/* Description - Order 3 on mobile, hide on desktop and show in first column */}
              <div className="flex-1 order-3 md:order-1 w-full md:hidden">
                <p className="text-lg text-slate-600 mb-6">
                  After a purchase or service, customers receive a link to your custom feedback page. They're greeted with a simple 1-5 star rating system to share their experience.
                </p>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Simple and mobile-friendly interface</span>
                </div>
              </div>

              {/* Desktop version - combined header and description */}
              <div className="hidden md:block flex-1 md:order-1">
                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm font-semibold rounded-full mb-4">
                  Step 1
                </div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Customer Rates Their Experience
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  After a purchase or service, customers receive a link to your custom feedback page. They're greeted with a simple 1-5 star rating system to share their experience.
                </p>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Simple and mobile-friendly interface</span>
                </div>
              </div>
            </div>

            {/* Step 2A - Low Rating Path */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Header - Mobile Order 1 */}
              <div className="flex-1 order-1 w-full md:hidden">
                <div className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full mb-4">Low Rating (1-3 Stars)</div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Unhappy Customers Give Private Feedback
                </h3>
              </div>

              {/* Graphic - Mobile Order 2, Desktop Order 1 */}
              <div className="flex-1 order-2 md:order-1 w-full">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-200">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-10 h-10 ${star <= 2 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <MessageSquare className="w-12 h-12 text-slate-900 mx-auto mb-2" />
                  <p className="text-center text-slate-700 font-medium">Private Feedback Form</p>
                </div>
              </div>

              {/* Description - Mobile Order 3 */}
              <div className="flex-1 order-3 w-full md:hidden">
                <p className="text-lg text-slate-600 mb-6">
                  Customers with low ratings are redirected to a private feedback form where they can share what went wrong. This keeps negative experiences out of public view and gives you a chance to make things right.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Capture detailed feedback privately</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Option for customers to request contact</span>
                  </div>
                </div>
              </div>

              {/* Desktop version - combined content */}
              <div className="hidden md:block flex-1 md:order-2">
                <div className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full mb-4">Low Rating (1-3 Stars)</div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Unhappy Customers Give Private Feedback
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Customers with low ratings are redirected to a private feedback form where they can share what went wrong. This keeps negative experiences out of public view and gives you a chance to make things right.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Capture detailed feedback privately</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Option for customers to request contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2B - High Rating Path */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Header - Mobile Order 1 */}
              <div className="flex-1 order-1 w-full md:hidden">
                <div className="inline-block px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full mb-4">High Rating (4-5 Stars)</div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Happy Customers Leave Public Reviews
                </h3>
              </div>

              {/* Graphic - Mobile Order 2, Desktop Order 2 */}
              <div className="flex-1 order-2 md:order-2 w-full">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-10 h-10 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <ExternalLink className="w-12 h-12 text-slate-900 mx-auto mb-2" />
                  <p className="text-center text-slate-700 font-medium">Public Review Platforms</p>
                </div>
              </div>

              {/* Description - Mobile Order 3 */}
              <div className="flex-1 order-3 w-full md:hidden">
                <p className="text-lg text-slate-600 mb-6">
                  Satisfied customers are directed to a thank-you page with direct links to your Google, Yelp, Facebook, or other review platforms. Make it easy for happy customers to share their experience publicly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Link to multiple review platforms</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Increase positive online reviews</span>
                  </div>
                </div>
              </div>

              {/* Desktop version - combined content */}
              <div className="hidden md:block flex-1 md:order-1">
                <div className="inline-block px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full mb-4">High Rating (4-5 Stars)</div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Happy Customers Leave Public Reviews
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Satisfied customers are directed to a thank-you page with direct links to your Google, Yelp, Facebook, or other review platforms. Make it easy for happy customers to share their experience publicly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Link to multiple review platforms</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Increase positive online reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Header - Mobile Order 1 */}
              <div className="flex-1 order-1 w-full md:hidden">
                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm font-semibold rounded-full mb-4">
                  Step 3
                </div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Track, Analyze, and Improve
                </h3>
              </div>

              {/* Graphic - Mobile Order 2, Desktop Order 1 */}
              <div className="flex-1 order-2 md:order-1 w-full">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-slate-900 mx-auto mb-4" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900 mb-1">4.8</div>
                        <div className="text-xs text-slate-600">Avg Rating</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900 mb-1">24</div>
                        <div className="text-xs text-slate-600">Feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Mobile Order 3 */}
              <div className="flex-1 order-3 w-full md:hidden">
                <p className="text-lg text-slate-600 mb-6">
                  View all feedback in your dashboard with real-time analytics. Export data, respond to concerns, and use insights to continuously improve your business.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Real-time dashboard with analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Export feedback data as CSV</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Identify trends and improvement areas</span>
                  </div>
                </div>
              </div>

              {/* Desktop version - combined content */}
              <div className="hidden md:block flex-1 md:order-2">
                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm font-semibold rounded-full mb-4">
                  Step 3
                </div>
                <h3 className="text-2xl md:text-3xl text-slate-900 mb-4">
                  Track, Analyze, and Improve
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  View all feedback in your dashboard with real-time analytics. Export data, respond to concerns, and use insights to continuously improve your business.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Real-time dashboard with analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Export feedback data as CSV</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Identify trends and improvement areas</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Summary */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-12">
            The Result? Better Reviews, Better Business
          </h2>

          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Start capturing feedback the smart way.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all shadow-lg inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2"
            >
              View Demo
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}