import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';
import { SEO } from './SEO';
const logo = "/logo.png";

export function ContactUsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SEO
        title="Contact Us - Get in Touch"
        description="Have questions about Feedback Page? Contact our support team for help with your account, features, or general inquiries. We're here to help."
        keywords="contact support, customer service, help center, feedback page support"
        canonical="https://feedback-page.com/contact-us"
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
                className="text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 md:py-2"
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
                  to="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <div className="flex flex-col justify-center">
            {/* Logo */}
            <div className="mb-8">
              
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-10">
              Have a question or need help? We're here to assist you. Send us a message and we'll respond as soon as possible.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">Email Us</h3>
                  <a 
                    href="mailto:support@feedback-page.com" 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    support@feedback-page.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">Call Us</h3>
                  <a 
                    href="tel:+18005551234" 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    1-800-555-1234
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1">Business Hours</h3>
                  <p className="text-sm text-gray-600">
                    Monday - Friday: 9am - 6pm EST<br />
                    Weekend: 10am - 4pm EST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-semibold text-black mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 placeholder:text-gray-400 transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-base hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" strokeWidth={2} />
                    Send Message
                  </>
                )}
              </button>

              {/* Submission Confirmation */}
              {submitted && (
                <div className="mt-4 text-sm text-green-500 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Message sent successfully!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}