import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { ordersAPI } from '../services/api';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
    'pk_test_1234567890abcdefghijklmnop'
);

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useContext(CartContext);
  const { showError } = useToast();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAppliedPromo(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal =
    cart?.items?.reduce((sum, item) => {
      return sum + (item.productId?.price * item.quantity || 0);
    }, 0) || 0;

  const discountPercentage = appliedPromo ? 10 : 0;
  const discountAmount = subtotal * (discountPercentage / 100);
  const taxRate = 0.1;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShipping = () => {
    const required = [
      'fullName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
    ];
    for (let field of required) {
      if (!shippingAddress[field]) {
        showError(`Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const createOrderForNonCardPayment = async () => {
    try {
      const orderData = {
        products: cart.items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
        shippingAddress,
        paymentMethod,
        totalAmount: subtotal,
        discountAmount,
        finalAmount: total,
      };

      const response = await ordersAPI.create(orderData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to create order';

      showError(`Failed to create order: ${errorMessage}`);
      return null;
    }
  };

  const handlePaymentSuccess = (order) => {
    onSuccess(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX className="text-2xl" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <p className="text-gray-600 mt-2">
              Complete your purchase in a few steps
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Review' },
              { num: 3, label: 'Payment Method' },
              { num: 4, label: 'Pay' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    step >= s.num
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.num ? <FiCheck /> : s.num}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step >= s.num ? 'text-orange-600' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s.num ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleShippingChange}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (validateShipping()) {
                      setStep(2);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Review
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                {cart?.items
                  ?.filter((item) => item.productId)
                  ?.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.productId.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="space-y-2 text-sm pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* Card Payment */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'card' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">
                      💳 Credit/Debit Card
                    </p>
                    <p className="text-sm text-gray-600">
                      Visa, Mastercard, Amex
                    </p>
                  </div>
                </label>

                {/* PayPal */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'paypal' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">🅿️ PayPal</p>
                    <p className="text-sm text-gray-600">
                      Fast and secure PayPal checkout
                    </p>
                  </div>
                </label>

                {/* Google Pay */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'googlepay' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="googlepay"
                    checked={paymentMethod === 'googlepay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">🔵 Google Pay</p>
                    <p className="text-sm text-gray-600">
                      Quick payment with Google Pay
                    </p>
                  </div>
                </label>

                {/* Apple Pay */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'applepay' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="applepay"
                    checked={paymentMethod === 'applepay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">🍎 Apple Pay</p>
                    <p className="text-sm text-gray-600">
                      Pay with Apple Pay on your device
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'bank' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">
                      🏦 Bank Transfer
                    </p>
                    <p className="text-sm text-gray-600">
                      Direct bank transfer
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50"
                  style={{
                    borderColor:
                      paymentMethod === 'cod' ? '#FF8A00' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">
                      💰 Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Complete Payment
                </h2>
                <p className="text-sm text-gray-600">
                  Payment Method:{' '}
                  <span className="font-semibold">
                    {paymentMethod === 'card'
                      ? 'Credit/Debit Card'
                      : paymentMethod === 'paypal'
                      ? 'PayPal'
                      : paymentMethod === 'googlepay'
                      ? 'Google Pay'
                      : paymentMethod === 'applepay'
                      ? 'Apple Pay'
                      : paymentMethod === 'bank'
                      ? 'Bank Transfer'
                      : 'Cash on Delivery'}
                  </span>
                </p>
              </div>

              {/* Stripe Card Payment */}
              {paymentMethod === 'card' && (
                <Elements stripe={stripePromise}>
                  <StripeCheckoutForm
                    total={total}
                    discountAmount={discountAmount}
                    shippingAddress={shippingAddress}
                    onSuccess={(order) => {
                      handlePaymentSuccess(order);
                      onClose();
                    }}
                    onCancel={() => setStep(3)}
                  />
                </Elements>
              )}

              {/* PayPal Payment */}
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-2xl mb-2">🅿️</p>
                    <p className="font-semibold text-gray-800 mb-2">
                      PayPal Checkout
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      You will be redirected to PayPal to complete the payment
                      securely.
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      Total: ${total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        const order = await createOrderForNonCardPayment();
                        if (order) {
                          alert(
                            'PayPal integration coming soon! Your order has been created. Please verify payment completion.'
                          );
                          handlePaymentSuccess(order);
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
                    >
                      Pay with PayPal
                    </button>
                  </div>
                </div>
              )}

              {/* Google Pay */}
              {paymentMethod === 'googlepay' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
                    <p className="text-2xl mb-2">🔵</p>
                    <p className="font-semibold text-gray-800 mb-2">
                      Google Pay
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Fast and secure payment with Google Pay.
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      Total: ${total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        const order = await createOrderForNonCardPayment();
                        if (order) {
                          alert(
                            'Google Pay integration coming soon! Your order has been created. Please verify payment completion.'
                          );
                          handlePaymentSuccess(order);
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
                    >
                      Pay with Google Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Apple Pay */}
              {paymentMethod === 'applepay' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 border-2 border-black rounded-lg p-6 text-center">
                    <p className="text-2xl mb-2">🍎</p>
                    <p className="font-semibold text-white mb-2">Apple Pay</p>
                    <p className="text-sm text-gray-300 mb-4">
                      Secure payment with Apple Pay on your device.
                    </p>
                    <p className="text-lg font-bold text-white">
                      Total: ${total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        const order = await createOrderForNonCardPayment();
                        if (order) {
                          alert(
                            'Apple Pay integration coming soon! Your order has been created. Please verify payment completion.'
                          );
                          handlePaymentSuccess(order);
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
                    >
                      Pay with Apple Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
                    <p className="font-semibold text-gray-800 mb-4">
                      🏦 Bank Transfer Details
                    </p>
                    <div className="bg-white p-4 rounded space-y-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Bank Name:</p>
                        <p className="font-semibold">First National Bank</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Account Number:</p>
                        <p className="font-semibold">1234567890</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Routing Number:</p>
                        <p className="font-semibold">021000021</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount:</p>
                        <p className="font-semibold text-lg text-orange-600">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded text-xs border border-yellow-200">
                        <p className="text-gray-700">
                          Please reference your order in the transfer note to
                          ensure proper tracking.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={async () => {
                          const order = await createOrderForNonCardPayment();
                          if (order) {
                            alert(
                              'Your order has been created. Please complete the bank transfer and your order will be confirmed once payment is received.'
                            );
                            handlePaymentSuccess(order);
                            onClose();
                          }
                        }}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                      >
                        I'll Transfer the Money
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on Delivery */}
              {paymentMethod === 'cod' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
                    <p className="text-2xl mb-2">💰</p>
                    <p className="font-semibold text-gray-800 mb-2">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Pay when your order arrives at your doorstep.
                    </p>
                    <p className="text-lg font-bold text-gray-800 mb-4">
                      Total to Pay on Delivery: ${total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 bg-white p-3 rounded border border-orange-200 mb-4">
                      ✓ Your order will be delivered within 5-7 business days
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        const order = await createOrderForNonCardPayment();
                        if (order) {
                          handlePaymentSuccess(order);
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
