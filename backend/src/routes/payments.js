const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Protect all payment routes
router.use(protect);

// Razorpay
router.post('/razorpay/initiate', paymentController.initiateRazorpay);
router.post('/razorpay/verify', paymentController.verifyRazorpay);

// Stripe
router.post('/stripe/initiate', paymentController.initiateStripe);

// PayPal
router.post('/paypal/initiate', paymentController.initiatePaypal);

module.exports = router;
