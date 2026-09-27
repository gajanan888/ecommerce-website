const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: String,
      image: String,
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      size: {
        type: String,
        default: 'M',
      },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
  },
  shipping: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'Paid', 'completed', 'failed', 'refunded'],
    default: 'unpaid',
  },
  stockDeducted: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: [
      'card',
      'paypal',
      'stripe',
      'razorpay',
      'googlepay',
      'applepay',
      'bank',
      'cod',
    ],
    required: false, // Not required on creation
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  trackingNumber: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
