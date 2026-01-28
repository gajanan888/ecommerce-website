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
      <div className="designer-card p-8 md:p-12 overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/5 rounded-full opacity-20 blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <FiMail size={32} className="text-orange-500" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">
              Join the <span className="text-orange-500">Elite</span>
            </h2>
            <p className="text-white/40 text-sm font-black uppercase tracking-[0.2em]">
              Exclusive access to new drops and sustainable styling tips.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { emoji: '🎁', label: 'OFFERS' },
              { emoji: '⚡', label: 'EARLY' },
              { emoji: '📦', label: 'FREE' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                  {item.emoji}
                </div>
                <p className="text-[10px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="space-y-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FiSend size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            <div className="h-6 flex items-center justify-center">
              {error && (
                <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  Welcome to the circle.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
