import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { orderAPI } from '../services/api';
import {
  FiCheck,
  FiLock,
  FiShoppingBag,
  FiLoader,
  FiArrowRight,
  FiTruck,
} from 'react-icons/fi';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentType, setPaymentType] = useState('upi');
  const [processing, setProcessing] = useState(false);

  // Razorpay state
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);

  // Stripe state
  const [clientSecret, setClientSecret] = useState(null);

  // PayPal state
  const [paypalOrderId, setPaypalOrderId] = useState(null);

  useEffect(() => {
    fetchOrder();
    loadPaymentScripts();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data); // Use .data.data to match backend
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    if (order?.shippingAddress) {
      setAddress({
        name: order.shippingAddress.name || user?.name || '',
        street: order.shippingAddress.street || '',
        city: order.shippingAddress.city || '',
        state: order.shippingAddress.state || '',
        zipCode: order.shippingAddress.zipCode || '',
        country: order.shippingAddress.country || '',
        phone: order.shippingAddress.phone || user?.phone || '',
      });
    } else if (user) {
      setAddress((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [order, user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveAddress = async () => {
    try {
      if (
        !address.name ||
        !address.street ||
        !address.city ||
        !address.zipCode ||
        !address.phone
      ) {
        showError('Please fill in all required address fields');
        return false;
      }

      await api.put(`/orders/${orderId}/address`, address);
      return true;
    } catch (error) {
      console.error('Error saving address:', error);
      showError('Failed to save delivery address');
      return false;
    }
  };

  const loadPaymentScripts = () => {
    // Load Razorpay script
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(razorpayScript);

    // Load Stripe script
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.body.appendChild(stripeScript);

    // Load PayPal script
    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
    document.body.appendChild(paypalScript);
  };

  const initiateRazorpayPayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post('/payments/razorpay/initiate', {
        orderId,
        amount: order.total,
        paymentType,
      });

      const {
        razorpayOrderId: rzpOrderId,
        razorpayKey,
        paymentId,
      } = initiateResponse.data;
      setRazorpayOrderId(rzpOrderId);

      if (razorpayKey && razorpayKey.includes('mock')) {
        console.log('🧪 Simulation Mode: Bypassing Razorpay SDK');
        // Simulate a delay for realism
        setTimeout(async () => {
          try {
            // Call verify endpoint with mock data
            const verifyResponse = await api.post('/payments/razorpay/verify', {
              razorpayOrderId: rzpOrderId,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: 'mock_signature',
              paymentId,
            });

            if (verifyResponse.data.success) {
              showSuccess('Payment successful! (Simulation)');
              setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
            }
          } catch (error) {
            showError('Payment verification failed!');
            setProcessing(false);
          }
        }, 1500);
        return;
      }

      // Step 2: Open Razorpay checkout (Real Mode)
      if (window.Razorpay) {
        const options = {
          key: razorpayKey,
          amount: Math.round(order.total * 100),
          currency: 'INR',
          order_id: rzpOrderId,
          name: 'Ecommerce Platform',
          description: `Order #${orderId}`,
          handler: async (response) => {
            // Step 3: Verify payment
            try {
              const verifyResponse = await api.post(
                '/payments/razorpay/verify',
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentId,
                }
              );

              if (verifyResponse.data.success) {
                showSuccess('Payment successful!');
                setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
              }
            } catch (error) {
              showError('Payment verification failed!');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', (response) => {
          showError(`Payment failed: ${response.error.description}`);
          setProcessing(false);
        });
        rzp1.open();
      }
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      showError('Error initiating payment');
      setProcessing(false);
    }
  };

  const initiateStripePayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post('/payments/stripe/initiate', {
        orderId,
        amount: order.total,
      });

      const { paymentId, clientSecret } = initiateResponse.data;
      setClientSecret(clientSecret);

      // Step 2: Redirect to Stripe checkout or use Stripe Elements
      // For simplicity, we'll redirect to a Stripe checkout page
      // In production, use Stripe Elements or hosted checkout
      window.location.href = `https://checkout.stripe.com/pay/${paymentId}`;
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
      showError('Error initiating payment');
      setProcessing(false);
    }
  };

  const initiatePayPalPayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post('/payments/paypal/initiate', {
        orderId,
        amount: order.total,
      });

      const { approvalLink, paypalOrderId } = initiateResponse.data;
      setPaypalOrderId(paypalOrderId);

      // Step 2: Redirect to PayPal approval link
      window.location.href = approvalLink;
    } catch (error) {
      console.error('Error initiating PayPal payment:', error);
      showError('Error initiating payment');
      setProcessing(false);
    }
  };

  const initiateCODPayment = async () => {
    try {
      setProcessing(true);
      const response = await orderAPI.confirmCOD(orderId);

      if (response.data.status === 'success') {
        showSuccess('Order placed successfully! Pay on delivery.');
        setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
      }
    } catch (error) {
      console.error('Error confirming COD order:', error);
      showError(error.response?.data?.message || 'Error confirming order');
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    const addressSaved = await saveAddress();
    if (!addressSaved) return;

    if (paymentMethod === 'razorpay') {
      initiateRazorpayPayment();
    } else if (paymentMethod === 'stripe') {
      initiateStripePayment();
    } else if (paymentMethod === 'paypal') {
      initiatePayPalPayment();
    } else if (paymentMethod === 'cod') {
      initiateCODPayment();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="text-blue-600 animate-spin" size={40} />
          <p className="text-slate-600 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Order Not Found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-24 px-4 md:px-6 relative isolate">
      {/* Editorial Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/5 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/5 to-transparent -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">
            Checkout Protocol
          </h1>
          <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">
            Finalize your architectural acquisition
          </p>
        </div>

        {/* Improved Progress Indicator */}
        <div className="flex items-center justify-between mb-20">
          {[
            { step: 1, label: 'BAG', active: true },
            { step: 2, label: 'PROTOCOL', active: true },
            { step: 3, label: 'ACQUIRE', active: false },
          ].map((item, idx, arr) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-[10px] transition-all duration-700 ${
                    item.active
                      ? 'bg-white text-black ring-8 ring-white/5'
                      : 'bg-white/5 text-white/20 border border-white/10'
                  }`}
                >
                  {item.step}
                </div>
                <span
                  className={`text-[8px] font-black tracking-[0.2em] ${item.active ? 'text-white' : 'text-white/20'}`}
                >
                  {item.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mb-8 mx-4 transition-colors duration-700 ${item.active ? 'bg-white/20' : 'bg-white/5'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {/* Order Summary Card */}
          <div className="designer-card p-8 md:p-12 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-white/5 font-black text-8xl -z-10 pointer-events-none select-none">
              SUMMARY
            </div>

            <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase">
              Specimen Inventory
            </h2>

            <div className="space-y-6 pb-8 border-b border-white/10">
              <div className="flex justify-between items-center group">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Protocol ID
                </span>
                <span className="font-black text-white text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg">
                  {orderId?.substring(0, 12).toUpperCase()}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-black text-white text-base tracking-tighter">
                  ₹{order.subtotal?.toFixed(0) || '0'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-orange-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Architect Discount ({order.discountPercentage}%)
                  </span>
                  <span className="font-black text-base tracking-tighter">
                    -₹{order.discount?.toFixed(0) || '0'}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Logistics
                </span>
                <span className="font-black text-green-500 text-[10px] uppercase tracking-widest">
                  Complimentary
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-8">
              <span className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Total Acquisition
              </span>
              <span className="text-5xl font-black text-white tracking-tighter">
                ₹{order.total?.toFixed(0) || '0'}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="designer-card p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
              <FiTruck className="text-orange-500" />
              Deployment Zone
            </h2>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Recipient
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Protocol Signal
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  Physical Coordinates
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Index
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Nation
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-xs"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Selection */}
          <div className="designer-card p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
              <FiLock className="text-orange-500" />
              Transfer Protocol
            </h2>

            <div className="space-y-4">
              {[
                {
                  id: 'razorpay',
                  name: 'Digital Ledger',
                  desc: 'Secure UPI & Cards',
                  icon: '⚡',
                },
                {
                  id: 'cod',
                  name: 'Physical Settlement',
                  desc: 'Settle upon arrival',
                  icon: '💵',
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`block border-2 p-8 rounded-[2rem] cursor-pointer transition-all duration-500 ${
                    paymentMethod === method.id
                      ? 'border-white bg-white text-black'
                      : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <div className="text-4xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-black text-base uppercase tracking-widest">
                        {method.name}
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${paymentMethod === method.id ? 'text-black/40' : 'text-white/20'}`}
                      >
                        {method.desc}
                      </p>
                    </div>
                    {paymentMethod === method.id && <FiCheck size={24} />}
                  </div>
                </label>
              ))}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full mt-12 bg-white text-black hover:bg-orange-500 hover:text-white font-black py-6 px-12 rounded-full transition-all duration-500 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] disabled:opacity-50"
            >
              {processing ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  <span>NEGOTIATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN PROTOCOL</span>
                  <FiArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
