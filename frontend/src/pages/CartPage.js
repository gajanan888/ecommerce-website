import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTitle } from '../hooks/useTitle';
import { orderAPI } from '../services/api';

export default function CartPage() {
  useTitle('Shopping Cart | StyleHub');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    // If user not authenticated, redirect to login
    if (!user) {
      // Store the intended redirect path
      localStorage.setItem('redirectAfterLogin', '/cart');
      navigate('/login', { state: { from: location } });
      return;
    }

    // User is authenticated, proceed with order placement
    try {
      setIsProcessing(true);
      setError('');

      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        subtotal,
        tax,
        shipping,
        total,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response.data.success) {
        // Clear cart after successful order
        clearCart();

        // Redirect to orders page
        navigate('/orders', {
          state: { message: 'Order placed successfully!' },
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to place order. Please try again.';
      setError(errorMessage);
      console.error('Order creation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
          <Link
            to="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium mb-12"
          >
            <FiArrowLeft size={20} />
            Back to Shopping
          </Link>

          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Start adding items to your cart!
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
        {/* Back Button */}
        <Link
          to="/products"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium mb-12"
        >
          <FiArrowLeft size={20} />
          Back to Shopping
        </Link>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-600 text-lg mb-12">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="border-b border-gray-200 last:border-b-0 p-6 hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
                    {/* Product Image */}
                    <div className="sm:col-span-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-[3/4] object-cover rounded-lg bg-gray-100"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="sm:col-span-3 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                          {item.category}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Size:{' '}
                          <span className="font-semibold">{item.size}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(item.id, item.size)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                            disabled={isProcessing}
                          >
                            <FiMinus size={18} />
                          </button>
                          <span className="font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id, item.size)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                            disabled={isProcessing}
                          >
                            <FiPlus size={18} />
                          </button>
                        </div>

                        {/* Price and Delete */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                            disabled={isProcessing}
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <p className="text-xs text-gray-500 mb-4">
                  Free shipping on orders over $100
                </p>
              )}

              {/* Total */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Placing order as{' '}
                    <span className="font-semibold">{user.name}</span>
                  </p>
                  <p className="text-xs text-blue-700">{user.email}</p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-300 active:scale-95 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full text-center py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Continue Shopping
              </Link>

              {/* Trust Badge */}
              <p className="text-xs text-gray-500 text-center mt-6">
                ✓ Secure checkout &nbsp;• &nbsp;30-day returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
