import { Link } from 'react-router';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
const logo = "/logo.png";

export function TermsOfServicePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <SEO
        title="Terms of Service"
        description="Read our terms of service to understand the rules and regulations for using Feedback Page. Learn about your rights and responsibilities."
        keywords="terms of service, user agreement, terms and conditions, service terms"
        canonical="https://feedback-page.com/terms"
      />

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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 md:gap-3">
              <Link
                to="/"
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
              >
                Home
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: February 13, 2026</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Feedback Page ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these Terms of Service, please do not use 
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p>
                Feedback Page is a SaaS platform that helps businesses capture negative customer experiences privately 
                while directing satisfied customers to leave public reviews on various review platforms. The Service 
                includes feedback collection, analytics, location management, and integration with third-party review 
                platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Account Registration</h2>
              <p className="mb-3">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the security of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information remains current and accurate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Subscription Plans and Billing</h2>
              <p className="mb-3">Feedback Page offers multiple subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Starter Plan:</strong> 1 location</li>
                <li><strong>Pro Plan:</strong> Up to 5 locations</li>
                <li><strong>Business Plan:</strong> Up to 15 locations</li>
                <li><strong>Enterprise Plan:</strong> Unlimited locations</li>
              </ul>
              <p className="mb-3">Billing terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Failure to pay may result in service suspension or termination</li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Acceptable Use Policy</h2>
              <p className="mb-3">You agree NOT to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Manipulate or artificially influence customer reviews</li>
                <li>Spam or harass customers</li>
                <li>Interfere with the Service's operation or security</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Customer Data and Feedback</h2>
              <p className="mb-3">Regarding customer feedback collected through the Service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of all customer data and feedback collected</li>
                <li>You are responsible for how you use and respond to customer feedback</li>
                <li>You must comply with all applicable privacy laws when collecting customer data</li>
                <li>We may use anonymized, aggregated data for analytics and service improvement</li>
                <li>You grant us permission to store and process customer data to provide the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Intellectual Property</h2>
              <p className="mb-4">
                The Service, including all content, features, and functionality, is owned by Feedback Page and is 
                protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our Service without our express 
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Third-Party Services</h2>
              <p>
                The Service may integrate with third-party review platforms (Google, Yelp, Facebook, TripAdvisor, 
                Trustpilot, etc.). We are not responsible for the availability, content, or practices of these 
                third-party services. Your use of third-party services is subject to their respective terms and 
                conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Service Availability</h2>
              <p className="mb-3">While we strive to maintain high availability:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We may suspend the Service for maintenance or updates</li>
                <li>We are not liable for any downtime or service interruptions</li>
                <li>We may modify or discontinue features with reasonable notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law, Feedback Page shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
                incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Feedback Page from any claims, damages, losses, liabilities, 
                and expenses (including legal fees) arising from your use of the Service, violation of these Terms, 
                or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Termination</h2>
              <p className="mb-3">We may terminate or suspend your account and access to the Service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For violation of these Terms</li>
                <li>For non-payment of fees</li>
                <li>If we cease operations</li>
                <li>For any reason with reasonable notice</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use the Service will immediately cease. You may export your data 
                before termination takes effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Data Export and Deletion</h2>
              <p>
                You may export your feedback data at any time using our CSV export feature. Upon account termination, 
                we will retain your data for 30 days, after which it will be permanently deleted unless required by 
                law to retain it longer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes via 
                email or through the Service. Your continued use of the Service after changes take effect constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
                which Feedback Page operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">16. Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or your use of the Service shall first be attempted to be 
                resolved through good faith negotiations. If negotiations fail, disputes will be resolved through 
                binding arbitration in accordance with applicable arbitration rules.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">17. Contact Information</h2>
              <p className="mb-3">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="font-medium text-slate-900">Feedback Page Support</p>
                <p className="text-slate-600">Email: legal@feedback-page.com</p>
              </div>
            </section>

            <section className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                By using Feedback Page, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}