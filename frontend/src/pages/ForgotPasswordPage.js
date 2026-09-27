import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await authAPI.forgotPassword({ email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to send reset link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-white/50 mt-2">
            Enter your email to receive a secure reset link.
          </p>
        </div>
        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
          className="w-full px-4 py-4 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <Link
          to="/login"
          className="block text-center text-xs text-white/50 hover:text-orange-500"
        >
          Back to login
        </Link>
      </form>
    </main>
  );
};

export default ForgotPasswordPage;
