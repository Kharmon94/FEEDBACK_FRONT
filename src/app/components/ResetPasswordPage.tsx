import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { api } from '../../services/api';
import { Lock, AlertCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError('Missing reset token. Please use the link from your email.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Password reset</h1>
          <p className="text-slate-600 mb-6">
            Your password has been updated. You can now sign in with your new password.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Choose a new password</h1>
          <p className="text-slate-600 mt-1">Enter your new password below.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {!token ? (
            <p className="text-slate-600 text-center">
              <Link to="/forgot-password" className="text-slate-900 font-medium hover:underline">
                Request a new reset link
              </Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">At least 6 characters</p>
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    id="confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
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
