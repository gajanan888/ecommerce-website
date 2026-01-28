import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiFeather
} from 'react-icons/fi';

const LoginPage = () => {
  useTitle('Login | EliteWear - Sign in to Your Account');
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
      const redirectPath = location.state?.from || location.state?.returnTo;
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Login failed. Please try again.' });
    }
  };

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
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion Editorial"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-16 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <FiFeather className="text-4xl text-orange-500" />
              <span className="text-3xl font-bold tracking-tight">EliteWear</span>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Redefine Your <br />
              <span className="text-orange-500">Digital Style.</span>
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Join our community of trendsetters. Access exclusive collections, track your orders, and personalize your shopping experience.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex text-yellow-500 text-sm">★★★★★</div>
                <span className="text-xs text-gray-400">Trusted by 50k+ fashionistas</span>
              </div>
            </div>
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
              <div className="text-4xl text-orange-500"><FiFeather /></div>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white">
              LOGIN
            </h2>
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
              Access your digital vault
            </p>
          </div>

          {errors.submit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Login Failed</h4>
                <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <FiMail className={`h-5 w-5 transition-colors ${isEmailValid ? 'text-green-500' : 'text-white/20 group-focus-within:text-orange-500'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-14 pr-10 py-5 bg-white/5 border-transparent border rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all duration-300 ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-2">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-white transition-colors">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-white/20 transition-colors group-focus-within:text-orange-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-14 pr-14 py-5 bg-white/5 border-transparent border rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all duration-300 ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/20 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-2">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-5 px-4 rounded-2xl shadow-2xl text-[10px] tracking-[0.3em] uppercase font-black text-black bg-white hover:bg-orange-500 hover:text-white transition-all duration-500 transform hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
              <span className="bg-[#0A0A0A] px-4 text-white/20">
                Alternative Identity
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all bg-white/5 text-white">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all bg-white/5 text-white">
              <img src="https://www.svgrepo.com/show/448234/apple.svg" alt="Apple" className="w-4 h-4 invert" />
              <span className="text-[10px] font-black uppercase tracking-widest">Apple</span>
            </button>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            No account?{' '}
            <Link to="/register" className="text-white hover:text-orange-500 transition-colors">
              Initialize here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
