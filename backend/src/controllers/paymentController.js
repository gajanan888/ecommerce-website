const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance if keys are available
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_mock_secret';

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * @desc    Initiate Razorpay Payment
 * @route   POST /api/payments/razorpay/initiate
 * @access  Private
 */
exports.initiateRazorpay = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'INR' } = req.body;

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_mock_secret';

    // If real keys are provided, create Razorpay Order
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency: currency,
        receipt: `receipt_${orderId || Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        razorpayKey: key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    }

    // Mock Response for Testing / Development without live keys
    res.status(200).json({
      success: true,
      razorpayOrderId: `order_mock_${Date.now()}`,
      razorpayKey: key_id,
      amount: Math.round(amount * 100),
      currency: currency,
      paymentId: `pay_mock_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay Payment
 * @route   POST /api/payments/razorpay/verify
 * @access  Private
 */
exports.verifyRazorpay = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (key_secret && razorpaySignature) {
      const hmac = crypto.createHmac('sha256', key_secret);
      hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Razorpay payment signature',
        });
      }
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required for payment verification',
      });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.stockDeducted) {
      const deductedProducts = [];
      try {
        for (const item of order.items) {
          const product = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          if (!product) {
            throw new Error('One or more products are out of stock');
          }
          deductedProducts.push(item);
        }
      } catch (stockError) {
        for (const item of deductedProducts) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        }
        return res.status(409).json({
          success: false,
          message: stockError.message,
        });
      }

      order.stockDeducted = true;
    }

    order.paymentStatus = 'Paid';
    order.status = 'processing';
    order.paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
    };
    order.paidAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initiate Stripe Payment
 * @route   POST /api/payments/stripe/initiate
 * @access  Private
 */
exports.initiateStripe = async (req, res, next) => {
  try {
    // Mock Response
    res.status(200).json({
      success: true,
      clientSecret: 'pi_mock_secret_12345',
      paymentId: `pay_stripe_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initiate PayPal Payment
 * @route   POST /api/payments/paypal/initiate
 * @access  Private
 */
exports.initiatePaypal = async (req, res, next) => {
  try {
    // Mock Response
    res.status(200).json({
      success: true,
      approvalLink: 'https://www.paypal.com/checkoutnow?token=mock_token',
      paypalOrderId: `pp_mock_${Date.now()}`,
      paymentId: `pay_pp_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
};
