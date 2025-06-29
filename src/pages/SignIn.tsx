
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Eye, LogIn } from 'lucide-react';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await signIn(email, password);
      if (success) {
        // Get user role and redirect accordingly
        const userRole = email.includes('admin') ? 'admin' : 
                        email.includes('manager') ? 'manager' : 'viewer';
        
        switch (userRole) {
          case 'admin':
            navigate('/');
            break;
          case 'manager':
            navigate('/manager-dashboard');
            break;
          case 'viewer':
            navigate('/viewer-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const quickSignIn = (email: string, role: string) => {
    setEmail(email);
    setPassword('demo123');
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 px-4 py-12 bg-blue-600">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Multi-Tenant Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <Link 
            to="/demo" 
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Live Demo
          </Link>
        </div>

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-full shadow-2xl block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 text-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 mb-6"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-full shadow-2xl block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 text-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="group relative flex justify-center py-2 px-8 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3 ">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span><strong>Admin:</strong> admin@acmecorp.com / demo123</span>
                <button
                  type="button"
                  onClick={() => quickSignIn('admin@acmecorp.com', 'admin')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Quick Sign In
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Manager:</strong> manager@acmecorp.com / demo123</span>
                <button
                  type="button"
                  onClick={() => quickSignIn('manager@acmecorp.com', 'manager')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Quick Sign In
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Viewer:</strong> viewer@acmecorp.com / demo123</span>
                <button
                  type="button"
                  onClick={() => quickSignIn('viewer@acmecorp.com', 'viewer')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Quick Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
