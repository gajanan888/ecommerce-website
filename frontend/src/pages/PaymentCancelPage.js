import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentCancelPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/checkout/${orderId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18zm0 2a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-2">Your payment was not completed</p>
        <p className="text-sm text-gray-500 mb-6">
          Order ID: <span className="font-semibold">{orderId}</span>
        </p>

        <div className="bg-white p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold mb-2 text-gray-700">What happened?</h2>
          <p className="text-sm text-gray-600">
            You cancelled the payment process. Your order is still in your cart
            and ready to be completed whenever you're ready.
          </p>
        </div>

        <button
          onClick={() => navigate(`/checkout/${orderId}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Try Again
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition mt-2"
        >
          Go Back Home
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to checkout in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
