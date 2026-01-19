const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// ========== RAZORPAY PAYMENT ROUTES ==========
router.post(
  '/razorpay/initiate',
  protect,
  paymentController.initiateRazorpayPayment
);
router.post(
  '/razorpay/verify',
  protect,
  paymentController.verifyRazorpayPayment
);

// ========== STRIPE PAYMENT ROUTES ==========
router.post(
  '/stripe/initiate',
  protect,
  paymentController.initiateStripePayment
);
router.post('/stripe/verify', protect, paymentController.verifyStripePayment);
router.post(
  '/create-intent',
  protect,
  paymentController.createStripePaymentIntent
);
router.post('/confirm', protect, paymentController.confirmStripePayment);

// ========== PAYPAL PAYMENT ROUTES ==========
router.post(
  '/paypal/initiate',
  protect,
  paymentController.initiatePayPalPayment
);
router.post('/paypal/verify', protect, paymentController.verifyPayPalPayment);

// ========== GENERAL PAYMENT ROUTES ==========
router.get('/:id/status', protect, paymentController.getPaymentStatus);
router.get('/history', protect, paymentController.getPaymentHistory);
router.post('/:id/refund', protect, paymentController.initiateRefund);

// ========== WEBHOOK ROUTES (NO AUTH) ==========
router.post('/webhook/razorpay', paymentController.handleRazorpayWebhook);
router.post('/webhook/stripe', paymentController.handleStripeWebhook);
router.post('/webhook/paypal', paymentController.handlePayPalWebhook);

module.exports = router;
