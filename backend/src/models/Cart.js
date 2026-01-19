const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required'],
        },
        productName: String,
        productImage: String,
        category: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
          max: [100, 'Quantity cannot exceed 100'],
        },
        size: {
          type: String,
          enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          default: 'M',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate cart total
cartSchema.methods.getTotal = function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// Calculate item count
cartSchema.methods.getItemCount = function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
};

// Check if product exists in cart
cartSchema.methods.hasProduct = function (productId, size) {
  return this.items.some(
    (item) => item.productId.toString() === productId && item.size === size
  );
};

module.exports = mongoose.model('Cart', cartSchema);
