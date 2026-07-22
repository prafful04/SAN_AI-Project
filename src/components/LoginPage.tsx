import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { GoogleAuthService, GoogleUser } from '../utils/googleAuth';

interface LoginPageProps {
  onLogin: (user: { email: string; name: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleButtonRef, setGoogleButtonRef] = useState<HTMLDivElement | null>(null);

  // Demo credentials for testing
  const demoCredentials = {
    email: 'demo@securebot.com',
    password: 'SecureBot2024!',
    name: 'Security Analyst',
    role: 'Security Professional'
  };

  const googleAuth = GoogleAuthService.getInstance();

  React.useEffect(() => {
    // Initialize Google Auth when component mounts
    googleAuth.initialize().catch(console.error);
  }, []);

  React.useEffect(() => {
    // Render Google Sign-In button when ref is available
    if (googleButtonRef && isLogin) {
      googleAuth.renderSignInButton(googleButtonRef, handleGoogleSignIn);
    }
  }, [googleButtonRef, isLogin]);

  const handleGoogleSignIn = (googleUser: GoogleUser) => {
    setSuccess('Google sign-in successful!');
    setTimeout(() => {
      onLogin({
        email: googleUser.email,
        name: googleUser.name,
        role: 'Security Professional'
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin && !formData.name) {
      setError('Name is required for registration');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Check demo credentials
        if (formData.email === demoCredentials.email && formData.password === demoCredentials.password) {
          setSuccess('Login successful!');
          setTimeout(() => {
            onLogin({
              email: demoCredentials.email,
              name: demoCredentials.name,
              role: demoCredentials.role
            });
          }, 1000);
        } else {
          setError('Invalid credentials. Try demo@securebot.com / SecureBot2024!');
        }
      } else {
        // Registration
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onLogin({
            email: formData.email,
            name: formData.name,
            role: 'Security Analyst'
          });
        }, 1000);
      }
      setIsLoading(false);
    }, 1500);
  };

  const loadDemoCredentials = () => {
    setFormData({
      email: demoCredentials.email,
      password: demoCredentials.password,
      confirmPassword: '',
      name: ''
    });
    setError('');
    setSuccess('Demo credentials loaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Shield className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SecureBot</h1>
          <p className="text-blue-200">Static Code Vulnerability Analysis</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLogin 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isLogin 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 text-center mt-2">
              {isLogin 
                ? 'Sign in to access your security analysis dashboard' 
                : 'Join SecureBot to start analyzing code security'
              }
            </p>
          </div>

          {/* Demo Credentials Banner */}
          {isLogin && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <strong>Demo Access:</strong> demo@securebot.com
                </div>
                <button
                  onClick={loadDemoCredentials}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Load Demo
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-green-800 text-sm">{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Shield size={20} />
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Google Sign-In */}
          {isLogin && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div ref={setGoogleButtonRef} />
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {isLogin ? 'Security Features' : 'Why Choose SecureBot?'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>🔒 End-to-end encryption</div>
                <div>🛡️ Advanced threat detection</div>
                <div>📊 Real-time analysis</div>
                <div>🔍 Comprehensive reporting</div>
                {!isLogin && (
                  <>
                    <div>⚡ Instant vulnerability detection</div>
                    <div>🔧 Automatic code fixes</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>© 2024 SecureBot. Protecting your code, one analysis at a time.</p>
        </div>
      </div>
    </div>
  );
};