const Payment = require('../models/Payment');
const Order = require('../models/Order');
const crypto = require('crypto');

// ========== RAZORPAY INTEGRATION ==========

exports.initiateRazorpayPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentType } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create Razorpay order
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId.toString(),
      notes: {
        orderId: orderId.toString(),
        userId: req.userId,
      },
    });

    // Create payment record
    const payment = await Payment.create({
      orderId,
      userId: req.userId,
      amount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentType: paymentType || 'upi',
      paymentStatus: 'initiated',
      razorpayOrderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } =
      req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentStatus: 'completed',
        razorpayPaymentId,
        razorpaySignature,
        gatewayTransactionId: razorpayPaymentId,
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Update order payment status
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'completed',
      transactionId: razorpayPaymentId,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== STRIPE INTEGRATION ==========

exports.initiateStripePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId.toString(),
        userId: req.userId,
      },
    });

    // Create payment record
    const payment = await Payment.create({
      orderId,
      userId: req.userId,
      amount,
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentType: 'card',
      paymentStatus: 'initiated',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        clientSecret: paymentIntent.client_secret,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentId } = req.body;

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status,
      });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentStatus: 'completed',
        stripePaymentIntentId: paymentIntentId,
        gatewayTransactionId: paymentIntent.id,
        paymentDetails: {
          email: paymentIntent.receipt_email,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Update order
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'completed',
      transactionId: paymentIntent.id,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PAYPAL INTEGRATION ==========

exports.initiatePayPalPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const axios = require('axios');

    // Get PayPal access token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const tokenResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Create PayPal order
    const paypalOrderResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amount.toString(),
                },
              },
            },
            custom_id: orderId.toString(),
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${process.env.FRONTEND_URL}/payment-success`,
              cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paypalOrderId = paypalOrderResponse.data.id;

    // Create payment record
    const payment = await Payment.create({
      orderId,
      userId: req.userId,
      amount,
      currency: 'USD',
      paymentMethod: 'paypal',
      paymentType: 'paypal',
      paymentStatus: 'initiated',
      paypalOrderId,
      metadata: {
        approvalLink: paypalOrderResponse.data.links.find(
          (link) => link.rel === 'approve'
        ).href,
      },
    });

    res.json({
      success: true,
      paypalOrderId,
      approvalLink: paypalOrderResponse.data.links.find(
        (link) => link.rel === 'approve'
      ).href,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayPalPayment = async (req, res) => {
  try {
    const { paypalOrderId, paymentId } = req.body;

    const axios = require('axios');

    // Get PayPal access token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const tokenResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Capture PayPal payment
    const captureResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = captureResponse.data;

    if (
      captureData.status !== 'COMPLETED' &&
      captureData.status !== 'APPROVED'
    ) {
      return res.status(400).json({
        error: 'Payment not completed',
        status: captureData.status,
      });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentStatus: 'completed',
        paypalOrderId,
        paypalTransactionId:
          captureData.purchase_units[0].payments.captures[0].id,
        gatewayTransactionId:
          captureData.purchase_units[0].payments.captures[0].id,
        paymentDetails: {
          email: captureData.payer.email_address,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Update order
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'completed',
      transactionId: captureData.purchase_units[0].payments.captures[0].id,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PAYMENT STATUS & HISTORY ==========

exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Payment.find({ userId: req.userId })
      .populate('orderId', 'totalAmount finalAmount status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      payments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== REFUND HANDLING ==========

exports.initiateRefund = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (payment.paymentStatus !== 'completed') {
      return res
        .status(400)
        .json({ error: 'Can only refund completed payments' });
    }

    let refundId;

    if (payment.paymentMethod === 'razorpay') {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(payment.amount * 100),
        notes: {
          reason,
        },
      });

      refundId = refund.id;
    } else if (payment.paymentMethod === 'stripe') {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round(payment.amount * 100),
        reason: 'requested_by_customer',
        metadata: {
          customReason: reason,
        },
      });

      refundId = refund.id;
    } else if (payment.paymentMethod === 'paypal') {
      const axios = require('axios');

      const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
      ).toString('base64');

      const tokenResponse = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const refund = await axios.post(
        `${process.env.PAYPAL_API_URL}/v2/payments/capture/${payment.paypalTransactionId}/refund`,
        {
          note_to_payer: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      refundId = refund.data.id;
    }

    // Update payment record
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentStatus: 'refunded',
        'refundDetails.refundId': refundId,
        'refundDetails.refundAmount': payment.amount,
        'refundDetails.refundStatus': 'completed',
        'refundDetails.refundDate': new Date(),
        'refundDetails.refundReason': reason,
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Update order
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'refunded',
    });

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      refundId,
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PAYMENT WEBHOOK HANDLERS ==========

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    const razorpaySignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    if (event === 'payment.authorized') {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.receipt;

      await Payment.findOneAndUpdate(
        { razorpayPaymentId: paymentId },
        { paymentStatus: 'completed' }
      );

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'completed',
        transactionId: paymentId,
      });
    } else if (event === 'payment.failed') {
      const paymentId = payload.payment.entity.id;

      await Payment.findOneAndUpdate(
        { razorpayPaymentId: paymentId },
        {
          paymentStatus: 'failed',
          failureReason: payload.payment.entity.vpa || 'Payment failed',
        }
      );
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: 'completed' }
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          paymentStatus: 'failed',
          failureReason: paymentIntent.last_payment_error?.message,
        }
      );
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handlePayPalWebhook = async (req, res) => {
  try {
    const axios = require('axios');

    // Verify webhook signature
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const verifyResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: req.headers['paypal-transmission-id'],
        transmission_time: req.headers['paypal-transmission-time'],
        cert_url: req.headers['paypal-cert-url'],
        auth_algo: req.headers['paypal-auth-algo'],
        transmission_sig: req.headers['paypal-transmission-sig'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: req.body,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (verifyResponse.data.verification_status !== 'SUCCESS') {
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    if (req.body.event_type === 'CHECKOUT.ORDER.COMPLETED') {
      const orderId = req.body.resource.custom_id;

      await Payment.findOneAndUpdate(
        { paypalOrderId: req.body.resource.id },
        { paymentStatus: 'completed' }
      );

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'completed',
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== STRIPE INTEGRATION ==========

exports.createStripePaymentIntent = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, products, discountAmount, shippingAddress } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        userId: req.userId,
        products: JSON.stringify(products),
      },
    });

    // Create order
    const order = await Order.create({
      userId: req.userId,
      products: products.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount: amount,
      discountAmount,
      finalAmount: amount,
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      shippingAddress,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      paymentIntent: {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
      order,
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.confirmStripePayment = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { _id: paymentIntent.metadata.orderId },
        { paymentStatus: 'completed', status: 'processing' },
        { new: true }
      ).populate('products.productId');

      // Reduce product stock
      const products = JSON.parse(paymentIntent.metadata.products);
      const Product = require('../models/Product');

      for (let product of products) {
        await Product.findByIdAndUpdate(product.productId, {
          $inc: { stock: -product.quantity },
        });
      }

      // Clear cart
      const Cart = require('../models/Cart');
      await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });

      return res.json({
        success: true,
        message: 'Payment confirmed',
        order,
      });
    }

    res.status(400).json({ error: 'Payment not completed' });
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getStripeTransactionHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
