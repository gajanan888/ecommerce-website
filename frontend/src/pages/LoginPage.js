import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiX,
} from 'react-icons/fi';

const LoginPage = () => {
  useTitle('Login | StyleHub - Sign in to Your Account');
  const { login, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!isEmailValid) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData);
      // Check if there's a redirect destination from location state
      const redirectPath = location.state?.from || location.state?.returnTo;
      // Fallback to localStorage for backward compatibility
      const redirectPathLegacy = localStorage.getItem('redirectAfterLogin');

      if (redirectPath) {
        navigate(redirectPath);
      } else if (redirectPathLegacy) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPathLegacy);
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Login failed. Please try again.' });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
      }}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 bg-orange-100 rounded-full w-96 h-96 opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 bg-orange-100 rounded-full w-96 h-96 opacity-3 blur-3xl"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 bg-white shadow-2xl rounded-3xl md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl text-white rounded-full shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 100%)',
              }}
            >
              🔐
            </div>
            <h1
              className="mb-2 text-3xl font-bold md:text-4xl"
              style={{ color: '#1a1a1a' }}
            >
              Welcome Back
            </h1>
            <p className="font-medium text-gray-600">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 mb-6 border-l-4 border-red-500 rounded-lg bg-red-50">
              <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <FiX size={18} /> {errors.submit}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute transition-colors transform -translate-y-1/2 left-4 top-1/2"
                  style={{
                    color: isEmailValid ? '#10B981' : '#9CA3AF',
                  }}
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full py-3 pl-12 pr-12 font-medium transition-all duration-300 border-2 rounded-xl"
                  style={{
                    borderColor: errors.email
                      ? '#EF4444'
                      : formData.email && !isEmailValid
                      ? '#F59E0B'
                      : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FF8C00';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.email
                      ? '#EF4444'
                      : '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                />
                {isEmailValid && (
                  <FiCheck
                    className="absolute text-green-500 transform -translate-y-1/2 right-4 top-1/2"
                    size={20}
                  />
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute transform -translate-y-1/2 left-4 top-1/2"
                  style={{ color: '#9CA3AF' }}
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-3 pl-12 pr-12 font-medium transition-all duration-300 border-2 rounded-xl"
                  style={{
                    borderColor: errors.password ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FF8C00';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.password
                      ? '#EF4444'
                      : '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isEmailValid || !formData.password}
              className="flex items-center justify-center w-full gap-2 px-8 py-3 font-semibold text-white transition-all duration-300 rounded-sm bg-gray-900 hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5"
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="font-medium text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-gray-900 hover:text-gray-700 transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-sm font-medium text-center text-white">
          <p>By signing in, you agree to our Terms & Conditions</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
