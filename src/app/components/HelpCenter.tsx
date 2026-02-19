import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ExternalLink, ChevronDown, ChevronUp,
  Mail, Book, HelpCircle, Settings, BarChart, CreditCard 
} from 'lucide-react';
import { Footer } from './Footer';
const logo = "/logo.png";

interface FAQArticle {
  icon: typeof ExternalLink;
  title: string;
  description: string;
  category: string;
  answer?: string;
}

export function HelpCenter() {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const popularArticles: FAQArticle[] = [
    {
      icon: ExternalLink,
      title: 'How to find your Google Review link',
      description: 'Step-by-step guide to locating your Google Business review URL',
      category: 'Setup',
      answer: 'To get your Google Review link, you need a Google Business Profile. Go to business.google.com, select your business location, click "Get more reviews" in the Home tab, and copy the short URL (e.g., g.page/r/...). Paste this URL into your Feedback Page location settings.',
    },
    {
      icon: Settings,
      title: 'Setting up your first feedback page',
      description: 'Complete walkthrough of the onboarding process',
      category: 'Getting Started',
      answer: 'After signing up, complete the onboarding flow to add your business name, logo, and review platform links. Then create a location. Share your feedback page URL (e.g. feedback-page.com/l/your-location-id) with customers. You can customize the page in Settings.',
    },
    {
      icon: BarChart,
      title: 'Understanding your feedback analytics',
      description: 'Learn how to interpret your dashboard metrics',
      category: 'Analytics',
      answer: 'Your dashboard shows total feedback, average rating, and positive vs negative counts. Positive is 4-5 stars; negative is 1-3 stars. Click a location to see the rating distribution and export feedback as CSV. Use these insights to identify improvement areas.',
    },
    {
      icon: Mail,
      title: 'Setting up email notifications',
      description: 'Get notified when you receive new feedback',
      category: 'Features',
      answer: 'In your location settings, enable email notifications and add the addresses that should receive alerts. You can also manage your email preferences at any time to control which emails you receive from Feedback Page.',
    },
    {
      icon: CreditCard,
      title: 'Billing and subscription management',
      description: 'Manage your plan, payment methods, and invoices',
      category: 'Billing',
      answer: 'Go to Dashboard > Billing to view your current plan, upgrade or downgrade, and manage payment methods. For plan changes or cancellations, use the Plans page. Contact support if you need help with invoices.',
    },
    {
      icon: Book,
      title: 'Best practices for collecting feedback',
      description: 'Tips to maximize response rates and quality',
      category: 'Tips',
      answer: 'Share your feedback link in receipts, follow-up emails, and at the point of experience. Keep the request simple and explain that you value their input. Respond to negative feedback privately to resolve issues before asking for a public review.',
    },
  ];

  const reviewPlatformGuides = [
    {
      name: 'Google Reviews',
      description: 'Find your Google Business Profile review link',
      steps: [
        'Open Google Business Profile Manager',
        'Select your business location',
        'Click "Get more reviews" in the Home tab',
        'Copy the short URL provided (e.g., g.page/r/...)',
        'Paste this URL in your Feedback Page settings',
      ],
      url: 'https://support.google.com/business/answer/7035772',
    },
    {
      name: 'Yelp',
      description: 'Get your Yelp business review link',
      steps: [
        'Go to your Yelp business page',
        'The URL in your browser is your review link',
        'Copy the full URL (e.g., yelp.com/biz/your-business)',
        'Paste into Feedback Page settings',
      ],
      url: 'https://www.yelp.com/business',
    },
    {
      name: 'Facebook',
      description: 'Find your Facebook Page review link',
      steps: [
        'Visit your Facebook Business Page',
        'Click "Reviews" in the left sidebar',
        'Copy your page URL from the browser',
        'Or use: facebook.com/YourPageName/reviews',
        'Add to Feedback Page settings',
      ],
      url: 'https://www.facebook.com/business',
    },
    {
      name: 'TripAdvisor',
      description: 'Locate your TripAdvisor review URL',
      steps: [
        'Sign in to TripAdvisor Management Center',
        'Navigate to your business listing',
        'Click "Write a Review" on your listing',
        'Copy the URL from your browser',
        'Add to your Feedback Page configuration',
      ],
      url: 'https://www.tripadvisor.com/Owners',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center md:justify-start">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src={logo} 
                  alt="Feedback Page" 
                  className="h-14 md:h-20"
                />
              </Link>
            </div>
            <div className="absolute right-4 sm:relative sm:right-0 flex items-center gap-2 md:gap-3">
              <Link
                to="/pricing"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Pricing
              </Link>
              <Link
                to="/dashboard"
                className="text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-slate-300">
            Browse popular topics and helpful guides below
          </p>
        </div>
      </section>

      {/* Popular Articles / FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Popular Articles & FAQ</h2>
        <div className="space-y-3">
          {popularArticles.map((article, index) => {
            const Icon = article.icon;
            const isExpanded = expandedArticle === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors"
              >
                <button
                  onClick={() => setExpandedArticle(isExpanded ? null : index)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-blue-600 mb-1 block">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600">{article.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                  )}
                </button>
                {isExpanded && article.answer && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-16 border-t border-slate-100 pt-4">
                      <p className="text-slate-700">{article.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Review Platform Guides */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Finding Your Review Links
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Step-by-step guides for each major review platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reviewPlatformGuides.map((platform, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-slate-600">{platform.description}</p>
                  </div>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <ol className="space-y-3">
                  {platform.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center">
                        {stepIndex + 1}
                      </span>
                      <span className="text-slate-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
            <Link
              to="/email-preferences"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl hover:bg-white/20 transition-colors font-medium"
            >
              Email Preferences
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl hover:bg-white/20 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}