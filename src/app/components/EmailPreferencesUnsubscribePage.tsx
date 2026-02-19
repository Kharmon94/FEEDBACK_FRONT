import { useSearchParams, Link } from 'react-router';
import { AlertCircle, CheckCircle } from 'lucide-react';
const logo = "/logo.png";
import { Footer } from './Footer';

export function EmailPreferencesUnsubscribePage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === '1';
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Feedback Page" className="h-14 md:h-20" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-center">
          {success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-slate-900 mb-2">You're unsubscribed</h1>
              <p className="text-slate-600 mb-6">
                You have been unsubscribed from Feedback Page emails. You can change your preferences at any time by signing in.
              </p>
              <Link
                to="/login"
                className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800"
              >
                Sign in
              </Link>
            </>
          ) : error === 'invalid_token' ? (
            <>
              <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Invalid or expired link</h1>
              <p className="text-slate-600 mb-6">
                This unsubscribe link is invalid or has expired. Sign in to manage your email preferences.
              </p>
              <Link
                to="/login"
                className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              <p className="text-slate-600">Loading...</p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
