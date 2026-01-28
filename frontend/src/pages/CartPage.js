import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiLock,
  FiTruck,
  FiTag,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTitle } from '../hooks/useTitle';
import { orderAPI } from '../services/api';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  useTitle('Shopping Cart | EliteWear');
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
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      navigate('/login', { state: { from: location } });
      return;
    }

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

      if (response.data.status === 'success') {
        const orderId = response.data.data?._id || response.data.data?.id;

        // Clear cart after successful order creation
        clearCart();

        // Redirect to checkout page for payment
        if (orderId) {
          navigate(`/checkout/${orderId}`);
        } else {
          // Fallback to orders page if no orderId
          navigate('/orders', {
            state: { message: 'Order placed successfully!' },
          });
        }
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

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-24 md:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative inline-block mb-12">
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                <FiShoppingBag
                  size={48}
                  className="text-white/20"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
              Archive Empty
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-12 max-w-md mx-auto leading-relaxed">
              No specimens recorded in your primary bag. Start building your architectural wardrobe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-2xl"
              >
                Enter Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Acquisition Log</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Specimen Bag
            </h1>
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
              {itemCount} ITEMS VALIDATED
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Cart Items Area - Left 2/3 */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="designer-card overflow-hidden p-0"
                  >
                    <div className="flex flex-col sm:flex-row gap-8 p-6 md:p-8">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-48 h-48 bg-white/5 rounded-2xl overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black mb-2">
                                {item.category}
                              </p>
                              <h3 className="text-3xl font-black text-white leading-none tracking-tighter">
                                {item.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="p-3 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-full transition-all duration-300"
                              disabled={isProcessing}
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Specimen Size:</span>
                              <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-white border border-white/5">
                                {item.size}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/5">
                            <button
                              onClick={() => decreaseQuantity(item.id, item.size)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black rounded-full transition-all"
                              disabled={isProcessing}
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-12 text-center font-black text-white text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id, item.size)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black rounded-full transition-all"
                              disabled={isProcessing}
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-3xl font-black text-white tracking-tighter">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary - Right 1/3 (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Summary Card */}
              <div className="designer-card p-10">
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">Sign-Off Protocol</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500">
                    {error}
                  </div>
                )}

                <div className="space-y-6 mb-10 pb-10 border-b border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Specimen Subtotal</span>
                    <span className="text-white text-base font-black">
                      ₹{subtotal.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Logistics</span>
                    <span className="text-green-500 font-black">
                      COMPLIMENTARY
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Protocol Tax</span>
                    <span className="text-white text-base font-black">
                      ₹{tax.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-12">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Signature Total</span>
                  <span className="text-5xl font-black text-white tracking-tighter">
                    ₹{total.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cart.length === 0}
                  className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed mb-6"
                >
                  {isProcessing ? 'Validating...' : 'Initialize Transfer'}
                </button>

                <div className="space-y-4 text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-3">
                    <FiLock size={12} className="text-orange-500" />
                    <span>256-Bit Encrypted Protocol</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiTruck size={12} className="text-white/20" />
                    <span>Global Express Deployment</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="designer-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FiTag className="text-white/20" size={16} />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Auth Code</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="ENTER PROTOCOL"
                    className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest placeholder-white/20 focus:border-white focus:outline-none transition-all"
                  />
                  <button className="px-8 py-4 bg-white/5 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
