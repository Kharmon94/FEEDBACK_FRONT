import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router';
import { api } from '../../services/api';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Footer } from './Footer';

const logo = '/logo.png';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const confirmed = searchParams.get('confirmed') === '1';
  const errorParam = searchParams.get('error');
  const emailFromState = (location.state as { email?: string })?.email ?? '';
  const [email, setEmail] = useState(emailFromState);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (emailFromState) setEmail(emailFromState);
  }, [emailFromState]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setResendError('Enter your email to resend the confirmation.');
      return;
    }
    setResending(true);
    setResendError('');
    setResendMessage('');
    try {
      const { message } = await api.resendConfirmation(email.trim());
      setResendMessage(message);
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  const pageContent = () => {
    if (confirmed) {
      return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Email confirmed</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your email has been verified. You can now sign in to your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Sign in
          </Link>
        </div>
      );
    }

    if (errorParam === 'invalid_token') {
      return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Invalid or expired link</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The confirmation link may have expired. You can request a new one below.
          </p>
          <div className="space-y-4">
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
              {resendMessage && (
                <p className="text-sm text-green-700">{resendMessage}</p>
              )}
              {resendError && (
                <p className="text-sm text-red-700 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {resendError}
                </p>
              )}
              <button
                type="submit"
                disabled={resending}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {resending ? 'Sending…' : 'Resend confirmation email'}
              </button>
            </form>
            <Link
              to="/login"
              className="block text-slate-600 hover:text-slate-900 font-medium"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
              <Mail className="w-12 h-12 text-slate-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
          <p className="text-slate-600 leading-relaxed">
            We've sent a confirmation link to your email. Click the link to verify your account.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
          <p className="text-sm text-slate-600 mb-4">
            Didn't receive the email? Enter your address below and we'll send it again.
          </p>
          <form onSubmit={handleResend} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
            {resendMessage && (
              <p className="text-sm text-green-700">{resendMessage}</p>
            )}
            {resendError && (
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {resendError}
              </p>
            )}
            <button
              type="submit"
              disabled={resending}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {resending ? 'Sending…' : 'Resend confirmation email'}
            </button>
          </form>
          <p className="mt-6 text-center">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/" className="inline-block">
            <img
              src={logo}
              alt="Feedback Page"
              className="h-14 md:h-16 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        {pageContent()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
