import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { api } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (token) {
      api.setToken(token);
      refreshUser().then(() => {
        navigate('/dashboard', { replace: true });
      });
    }
  }, [token, refreshUser, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-700 mb-4">Sign-in failed. Please try again.</p>
        <Link
          to="/login"
          className="text-slate-900 font-medium underline hover:no-underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-700">Signing you in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <p className="text-slate-700 mb-4">No token received. Please try signing in again.</p>
      <Link
        to="/login"
        className="text-slate-900 font-medium underline hover:no-underline"
      >
        Back to login
      </Link>
    </div>
  );
}
