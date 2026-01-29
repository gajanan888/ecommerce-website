import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Could fetch order details and payment status here
    const timer = setTimeout(() => {
      navigate(`/order/${orderId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase</p>
        <p className="text-sm text-gray-500 mb-6">
          Order ID: <span className="font-semibold">{orderId}</span>
        </p>

        <div className="bg-white p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold mb-2 text-gray-700">What's next?</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Check your email for order confirmation</li>
            <li>✓ Track your order in your account</li>
            <li>✓ Delivery updates will be sent via SMS</li>
          </ul>
        </div>

        <button
          onClick={() => navigate(`/order/${orderId}`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          View Order Details
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition mt-2"
        >
          Continue Shopping
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to order details in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
