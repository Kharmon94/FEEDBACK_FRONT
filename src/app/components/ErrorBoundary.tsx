import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              An unexpected error occurred. Please try refreshing the page. If the problem persists, contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
              >
                Refresh page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
