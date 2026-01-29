import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FiCheckCircle, FiLoader, FiHome, FiPackage } from 'react-icons/fi';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      showError(
        error.response?.data?.message || 'Failed to load order details'
      );
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium mb-6">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FiCheckCircle className="text-6xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-gray-600 text-sm mb-1">Order Number</p>
            <p className="text-2xl font-bold text-blue-600">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Confirmation email sent to {order.userId?.email}
            </p>
          </div>

          {/* Order Status */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-gray-600 text-sm mb-2">Order Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                  statusColors[order.status]
                }`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Payment Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                  order.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.paymentStatus?.charAt(0).toUpperCase() +
                  order.paymentStatus?.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage /> Order Items
            </h2>
            <div className="space-y-3">
              {(order.items || order.products)?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.productName || item.productId?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>
                  ₹{(order.subtotal || order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
              {(order.discountAmount > 0 || order.discount > 0) && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>
                    -₹{(order.discountAmount || order.discount || 0).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 pt-3 border-t border-gray-200">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-blue-600">
                  ₹
                  {(
                    order.total ||
                    order.finalAmount ||
                    order.totalAmount ||
                    0
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-3">Shipping Address</h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  {order.shippingAddress.name || order.shippingAddress.fullName}
                </p>
                <p>
                  {order.shippingAddress.street ||
                    order.shippingAddress.address}
                </p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-3">What's Next?</h3>
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>
                ✓ You'll receive a shipping notification when your order ships
              </li>
              <li>✓ Track your package using the order number above</li>
              <li>✓ Most orders arrive within 5-7 business days</li>
              <li>✓ Questions? Contact us at support@shophub.com</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiHome /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <p className="text-blue-600 font-medium cursor-pointer hover:underline">
            Contact Customer Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
