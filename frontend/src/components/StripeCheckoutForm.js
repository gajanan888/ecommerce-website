import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FiLoader, FiCheckCircle } from 'react-icons/fi';
import { paymentsAPI } from '../services/api';

const CheckoutForm = ({
  total,
  discountAmount,
  onSuccess,
  onCancel,
  shippingAddress,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { cart, clearCart } = useContext(CartContext);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (processing) {
      return;
    }

    setProcessing(true);
    setLoading(true);

    try {
      // Get card details
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.name,
          email: user?.email,
        },
      });

      if (error) {
        setError(error.message);
        showError(`Payment failed: ${error.message}`);
        setProcessing(false);
        setLoading(false);
        return;
      }

      // Create payment intent on backend
      const response = await paymentsAPI.createPaymentIntent({
        amount: total,
        paymentMethodId: paymentMethod.id,
        products: cart.items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
        discountAmount,
        shippingAddress,
        userId: user._id,
      });

      if (response.success && response.paymentIntent) {
        // Confirm payment with Stripe
        const confirmResult = await stripe.confirmCardPayment(
          response.paymentIntent.clientSecret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmResult.error) {
          setError(confirmResult.error.message);
          showError(
            `Payment confirmation failed: ${confirmResult.error.message}`
          );
          setProcessing(false);
          setLoading(false);
          return;
        }

        if (
          confirmResult.paymentIntent.status === 'succeeded' ||
          confirmResult.paymentIntent.status === 'processing'
        ) {
          setSucceeded(true);
          setError(null);
          showSuccess('Payment successful! Order created.');

          // Clear cart
          await clearCart();

          setTimeout(() => {
            onSuccess(response.order);
          }, 1500);
        }
      } else {
        throw new Error(response.error || 'Payment processing failed');
      }
    } catch (err) {
      setError(err.message);
      showError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>

      {succeeded ? (
        <div className="text-center py-8">
          <FiCheckCircle className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-600 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting you to order confirmation...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Element */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <CardElement options={cardStyle} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-700 text-sm">{error}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="space-y-2 text-sm">
              {discountAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span className="text-orange-600">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-orange-200">
                <span>Total:</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || processing}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!stripe || loading || processing || succeeded}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading || processing ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Your payment information is secure and encrypted.
          </p>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
