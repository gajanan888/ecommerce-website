import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
  FiCheck,
  FiX,
} from 'react-icons/fi';

const RegisterPage = () => {
  const { register, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect authenticated users away from signup page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
    return colors[passwordStrength - 1] || '#E5E7EB';
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength];
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!validateEmail(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (passwordStrength < 2) newErrors.password = 'Password must be stronger';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });
      navigate('/');
    } catch (err) {
      setErrors({
        submit: err.message || 'Registration failed. Please try again.',
      });
    }
  };

  const passwordStrengthChecks = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    {
      label: 'Mix of upper and lowercase',
      met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    },
    { label: 'Contains number', met: /\d/.test(formData.password) },
    {
      label: 'Contains special character',
      met: /[!@#$%^&*]/.test(formData.password),
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
      }}
    >
      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              Join StyleHub
            </h1>
            <p className="text-gray-600 font-medium text-sm">
              Discover your style. Express yourself.
            </p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
                <FiX size={18} /> {errors.submit}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl font-medium transition-all duration-300"
                  style={{
                    borderColor: errors.name ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1F2937';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.name
                      ? '#EF4444'
                      : '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-2 font-semibold">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{
                    color:
                      validateEmail(formData.email) && formData.email
                        ? '#10B981'
                        : '#9CA3AF',
                  }}
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-12 py-3 border-2 rounded-xl font-medium transition-all duration-300"
                  style={{
                    borderColor: errors.email ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1F2937';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.email
                      ? '#EF4444'
                      : '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                />
                {validateEmail(formData.email) && formData.email && (
                  <FiCheck
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                    size={20}
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 rounded-xl font-medium transition-all duration-300"
                  style={{
                    borderColor: errors.password ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1F2937';
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= passwordStrength
                              ? getPasswordStrengthColor()
                              : '#E5E7EB',
                        }}
                      ></div>
                    ))}
                  </div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    Strength: {getPasswordStrengthLabel()}
                  </p>

                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2">
                    {passwordStrengthChecks.map((check, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                          style={{
                            backgroundColor: check.met ? '#10B981' : '#E5E7EB',
                          }}
                        >
                          {check.met && <FiCheck size={12} />}
                        </div>
                        <span
                          style={{ color: check.met ? '#10B981' : '#9CA3AF' }}
                        >
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-semibold">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{
                    color:
                      formData.password === formData.confirmPassword &&
                      formData.confirmPassword
                        ? '#10B981'
                        : '#9CA3AF',
                  }}
                  size={20}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 rounded-xl font-medium transition-all duration-300"
                  style={{
                    borderColor: errors.confirmPassword ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1F2937';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.confirmPassword
                      ? '#EF4444'
                      : '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2 font-semibold">
                  {errors.confirmPassword}
                </p>
              )}
              {formData.password === formData.confirmPassword &&
                formData.confirmPassword && (
                  <p className="text-green-500 text-xs mt-2 font-semibold flex items-center gap-1">
                    <FiCheck size={14} /> Passwords match
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !validateEmail(formData.email) ||
                passwordStrength < 2 ||
                formData.password !== formData.confirmPassword
              }
              className="w-full py-3 rounded-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 bg-gray-900 hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 mt-6"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 font-medium text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-gray-900 hover:text-gray-700 transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Sign in
            </button>
          </p>

          {/* T&C */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our Terms & Conditions and Privacy
            Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
