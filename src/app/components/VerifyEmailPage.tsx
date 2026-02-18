import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router';
import { api } from '../../services/api';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

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

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Email confirmed</h1>
          <p className="text-slate-600 mb-6">
            Your email has been verified. You can now sign in to your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (errorParam === 'invalid_token') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-amber-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Invalid or expired link</h1>
          <p className="text-slate-600 mb-6">
            The confirmation link may have expired. You can request a new one below.
          </p>
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Mail className="w-16 h-16 text-slate-400" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
          <p className="text-slate-600 mt-1">
            We've sent a confirmation link to your email. Click the link to verify your account.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <p className="text-sm text-slate-600 mb-4">
            Didn't receive the email? Enter your address below and we'll send it again.
          </p>
          <form onSubmit={handleResend} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
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
              className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend confirmation email'}
            </button>
          </form>
          <p className="mt-6 text-center">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
