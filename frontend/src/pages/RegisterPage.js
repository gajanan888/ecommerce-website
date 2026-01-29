import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
  FiFeather,
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
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
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
    <div className="flex min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Left Side - Image & Brand (Desktop) */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop"
            alt="Fashion Editorial"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-16 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <FiFeather className="text-4xl text-orange-500" />
              <span className="text-3xl font-bold tracking-tight">
                EliteWear
              </span>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Join the <br />
              <span className="text-orange-500">Fashion Revolution.</span>
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Create an account to start your journey. Get personalized
              recommendations, early access to sales, and seamless checkout.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            © 2024 EliteWear Inc. All rights reserved.
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Background blobs for mobile/tablet */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md space-y-8 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white/5 relative z-10"
        >
          <div className="text-center space-y-4">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="text-4xl text-orange-500">
                <FiFeather />
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase">
              REGISTER
            </h2>
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
              Initialize your fashion identity
            </p>
          </div>

          {errors.submit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <FiAlertCircle
                className="text-red-500 mt-0.5 flex-shrink-0"
                size={18}
              />
              <div>
                <h4 className="text-sm font-semibold text-red-800">
                  Registration Failed
                </h4>
                <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-white/20 transition-colors group-focus-within:text-orange-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-14 pr-4 py-4 bg-white/5 border-transparent border rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all duration-300 ${errors.name ? 'border-red-500/5 bg-red-500/5 focus:border-red-500' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FiMail
                    className={`h-5 w-5 transition-colors ${validateEmail(formData.email) && formData.email ? 'text-green-500' : 'text-white/20 group-focus-within:text-orange-500'}`}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-14 pr-10 py-4 bg-white/5 border-transparent border rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all duration-300 ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Address Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Shipping Address (Optional)
              </h3>

              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                placeholder="Street Address"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  placeholder="State"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  placeholder="Zip Code"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-orange-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 ${errors.password ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= passwordStrength
                              ? getPasswordStrengthColor()
                              : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {passwordStrengthChecks.map((check, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div
                          className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${check.met ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                          {check.met && <FiCheck size={8} />}
                        </div>
                        <span
                          className={`text-[10px] ${check.met ? 'text-green-700 font-medium' : 'text-gray-500'}`}
                        >
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock
                    className={`h-5 w-5 transition-colors ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400 group-focus-within:text-orange-500'}`}
                  />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 border-gray-200 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 ${errors.confirmPassword ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !validateEmail(formData.email) ||
                passwordStrength < 2 ||
                formData.password !== formData.confirmPassword
              }
              className="w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase text-black bg-white hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-2xl transform hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  INITIALIZING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  CREATE IDENTITY <FiArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-gray-900 font-bold hover:underline transition-all"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
