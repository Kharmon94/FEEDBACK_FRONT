import { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

export function ContactSupportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-3">
            Support Ticket Submitted!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for contacting us. Our support team will get back to you within 24 hours at <strong>{user?.email}</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-white text-black border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl text-black mb-2">Contact Support</h2>
        <p className="text-gray-600">
          Need help? Submit a support request and our team will assist you as soon as possible.
        </p>
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Email (Read-only) */}
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="user-email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send the response to this email address
            </p>
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
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">Select a subject</option>
              <option value="general">General Question</option>
              <option value="technical">Technical Support</option>
              <option value="billing">Billing & Payment</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Report a Bug</option>
              <option value="account">Account Issue</option>
              <option value="integration">Integration Help</option>
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
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
              placeholder="Please describe your issue or question in detail..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Include any relevant details, error messages, or steps to reproduce the issue
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard?tab=help')}
              className="px-6 py-3 bg-white text-black border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Email Support Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="inline-flex h-12 w-12 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-black" />
        </div>
        <h3 className="text-sm font-semibold text-black mb-2">Email Support</h3>
        <a 
          href="mailto:support@feedback-page.com" 
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          support@feedback-page.com
        </a>
      </div>

      {/* Help Resources */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-2">Need immediate help?</h3>
        <p className="text-gray-700 mb-4">
          Check out our Help Center for answers to common questions and step-by-step guides.
        </p>
        <button
          onClick={() => navigate('/dashboard?tab=help')}
          className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          View Help Center
        </button>
      </div>
    </div>
  );
}