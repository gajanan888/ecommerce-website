const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR"],
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["razorpay", "stripe", "paypal"],
  },
  paymentType: {
    type: String,
    required: true,
    enum: ["upi", "card", "netbanking", "wallet", "paypal"],
  },
  paymentStatus: {
    type: String,
    enum: ["initiated", "pending", "completed", "failed", "refunded"],
    default: "initiated",
  },
  gatewayTransactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  stripePaymentIntentId: String,
  stripeSessionId: String,
  paypalTransactionId: String,
  paypalOrderId: String,
  paymentDetails: {
    email: String,
    phone: String,
    cardLast4: String,
    upiId: String,
    walletType: String,
  },
  receipt: String,
  failureReason: String,
  failureCode: String,
  metadata: mongoose.Schema.Types.Mixed,
  refundDetails: {
    refundId: String,
    refundAmount: Number,
    refundStatus: String,
    refundDate: Date,
    refundReason: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
});

// Index for finding payments by gateway transaction ID
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
