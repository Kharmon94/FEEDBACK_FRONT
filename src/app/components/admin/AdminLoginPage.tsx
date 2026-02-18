import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
const logo = "/logo.png";
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../../services/api';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signOut } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('Invalid email or password.');
        return;
      }
      const user = await api.getCurrentUser();
      if (user?.admin) {
        navigate('/admin');
      } else {
        setError('Admin access only. This account does not have admin privileges.');
        await signOut();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Feedback Page" className="h-24 w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          </div>
          <p className="text-slate-600">System Administrator Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <p className="text-right">
              <Link to="/forgot-password" className="text-sm text-slate-600 hover:text-slate-900">
                Forgot password?
              </Link>
            </p>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
              <p>
                This is a restricted area. All access attempts are logged. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    </div>
  );
}