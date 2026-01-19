import React, { useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 md:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiMail size={32} style={{ color: '#FF8C00' }} />
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{ color: '#1a1a1a' }}
              >
                Stay Updated
              </h2>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              Subscribe to our newsletter and get exclusive offers, new
              arrivals, and insider tips delivered to your inbox.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="text-center">
              <div className="text-3xl mb-2">🎁</div>
              <p className="text-sm font-semibold text-gray-700">
                Exclusive Offers
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-gray-700">
                Early Access
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm font-semibold text-gray-700">
                Free Shipping
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="flex-1 px-6 py-4 rounded-xl border-2 font-medium transition-all duration-300"
                style={{
                  borderColor: error ? '#FF8A00' : '#E0E0E0',
                  backgroundColor: '#F8F9FA',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FF8C00';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? '#FF8A00'
                    : '#E0E0E0';
                  e.currentTarget.style.backgroundColor = '#F8F9FA';
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl active:scale-95"
                style={{
                  backgroundColor: '#FF8C00',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#E67E00';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#FF8C00';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FiSend size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-orange-600 font-semibold text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="text-orange-600 font-semibold text-sm flex items-center gap-2 animate-pulse">
                <span>✅</span> Thank you for subscribing! Check your email for
                exclusive welcome offer.
              </p>
            )}

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
