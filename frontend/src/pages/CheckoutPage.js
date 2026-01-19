import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import {
  FiCheck,
  FiLock,
  FiShoppingBag,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [paymentType, setPaymentType] = useState("upi");
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
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false);
    }
  };

  const loadPaymentScripts = () => {
    // Load Razorpay script
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(razorpayScript);

    // Load Stripe script
    const stripeScript = document.createElement("script");
    stripeScript.src = "https://js.stripe.com/v3/";
    document.body.appendChild(stripeScript);

    // Load PayPal script
    const paypalScript = document.createElement("script");
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
    document.body.appendChild(paypalScript);
  };

  const initiateRazorpayPayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post("/payments/razorpay/initiate", {
        orderId,
        amount: order.totalAmount,
        paymentType,
      });

      const { razorpayOrderId, razorpayKey, paymentId } = initiateResponse.data;
      setRazorpayOrderId(razorpayOrderId);

      // Step 2: Open Razorpay checkout
      if (window.Razorpay) {
        const options = {
          key: razorpayKey,
          amount: Math.round(order.totalAmount * 100),
          currency: "INR",
          order_id: razorpayOrderId,
          name: "Ecommerce Platform",
          description: `Order #${orderId}`,
          handler: async (response) => {
            // Step 3: Verify payment
            try {
              const verifyResponse = await api.post(
                "/payments/razorpay/verify",
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentId,
                }
              );

              if (verifyResponse.data.success) {
                showSuccess("Payment successful!");
                setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
              }
            } catch (error) {
              showError("Payment verification failed!");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", (response) => {
          showError(`Payment failed: ${response.error.description}`);
          setProcessing(false);
        });
        rzp1.open();
      }
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      showError("Error initiating payment");
      setProcessing(false);
    }
  };

  const initiateStripePayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post("/payments/stripe/initiate", {
        orderId,
        amount: order.totalAmount,
      });

      const { clientSecret, paymentId } = initiateResponse.data;
      setClientSecret(clientSecret);

      // Step 2: Redirect to Stripe checkout or use Stripe Elements
      // For simplicity, we'll redirect to a Stripe checkout page
      // In production, use Stripe Elements or hosted checkout
      window.location.href = `https://checkout.stripe.com/pay/${paymentId}`;
    } catch (error) {
      console.error("Error initiating Stripe payment:", error);
      showError("Error initiating payment");
      setProcessing(false);
    }
  };

  const initiatePayPalPayment = async () => {
    try {
      setProcessing(true);

      // Step 1: Initiate payment from backend
      const initiateResponse = await api.post("/payments/paypal/initiate", {
        orderId,
        amount: order.totalAmount,
      });

      const { approvalLink, paypalOrderId, paymentId } = initiateResponse.data;
      setPaypalOrderId(paypalOrderId);

      // Step 2: Redirect to PayPal approval link
      window.location.href = approvalLink;
    } catch (error) {
      console.error("Error initiating PayPal payment:", error);
      showError("Error initiating payment");
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      initiateRazorpayPayment();
    } else if (paymentMethod === "stripe") {
      initiateStripePayment();
    } else if (paymentMethod === "paypal") {
      initiatePayPalPayment();
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
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-6 md:py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 flex items-center gap-3">
            <FiShoppingBag className="text-blue-600" />
            <span>Secure Checkout</span>
          </h1>
          <p className="text-slate-600">Complete your purchase securely</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          {[
            { step: 1, label: "Order", icon: FiShoppingBag },
            { step: 2, label: "Payment", icon: FiLock },
            { step: 3, label: "Confirm", icon: FiCheck },
          ].map((item, idx, arr) => (
            <div key={item.step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all ${
                  item.step <= 2
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {item.step}
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 md:mx-4 rounded-full transition-all ${
                    item.step < 2
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold bg-slate-200 text-slate-600">
            3
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 border-opacity-50 p-6 md:p-8 mb-8 md:mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 pb-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Order ID</span>
              <span className="font-bold text-slate-900 font-mono">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">
                ${order.subtotal?.toFixed(2) || "0.00"}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between items-center text-green-600 font-bold">
                <span>Discount ({order.discountPercentage}%)</span>
                <span>-${order.discount?.toFixed(2) || "0.00"}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Shipping</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Tax (10%)</span>
              <span className="font-bold text-slate-900">
                ${(order.tax || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 border-opacity-50 rounded-2xl">
            <span className="text-lg font-bold text-slate-900">
              Total Amount
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ${order.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 border-opacity-50 p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FiLock className="text-blue-600" size={24} />
            Select Payment Method
          </h2>

          {/* Razorpay Option */}
          <label
            className={`block mb-4 p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              paymentMethod === "razorpay"
                ? "border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
                : "border-slate-300 bg-white hover:border-blue-400"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">Razorpay</h3>
                <p className="text-slate-500 text-sm font-medium">
                  UPI, Cards, Net Banking, Wallet
                </p>
              </div>
              <div className="text-2xl">💳</div>
            </div>

            {paymentMethod === "razorpay" && (
              <div className="mt-5 ml-9 space-y-3 pt-5 border-t border-blue-200">
                {[
                  { value: "upi", label: "UPI", icon: "📱" },
                  { value: "card", label: "Credit/Debit Card", icon: "🏧" },
                  { value: "netbanking", label: "Net Banking", icon: "🏦" },
                  { value: "wallet", label: "Digital Wallet", icon: "💰" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="razorpayType"
                      value={option.value}
                      checked={paymentType === option.value}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-600">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </label>

          {/* Stripe Option */}
          <label
            className={`block mb-4 p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              paymentMethod === "stripe"
                ? "border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
                : "border-slate-300 bg-white hover:border-blue-400"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">Stripe</h3>
                <p className="text-slate-500 text-sm font-medium">
                  Cards, Google Pay, Apple Pay
                </p>
              </div>
              <div className="text-2xl">✨</div>
            </div>
          </label>

          {/* PayPal Option */}
          <label
            className={`block mb-6 p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              paymentMethod === "paypal"
                ? "border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
                : "border-slate-300 bg-white hover:border-blue-400"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">PayPal</h3>
                <p className="text-slate-500 text-sm font-medium">
                  PayPal Wallet, Linked Cards
                </p>
              </div>
              <div className="text-2xl">🅿️</div>
            </div>
          </label>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 md:py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
          >
            {processing ? (
              <>
                <FiLoader className="animate-spin" size={22} />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <span>Pay ${order.totalAmount?.toFixed(2) || "0.00"}</span>
                <FiArrowRight size={22} />
              </>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
            <FiLock size={16} className="text-green-600" />
            <span>Your payment is 100% secure and encrypted</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="text-center bg-white rounded-2xl p-4 border border-slate-200 border-opacity-50">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-xs md:text-sm font-medium text-slate-600">
              256-bit SSL
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-slate-200 border-opacity-50">
            <div className="text-2xl mb-2">✓</div>
            <p className="text-xs md:text-sm font-medium text-slate-600">
              Money-back
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-slate-200 border-opacity-50">
            <div className="text-2xl mb-2">🛡️</div>
            <p className="text-xs md:text-sm font-medium text-slate-600">
              Buyer Safe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
