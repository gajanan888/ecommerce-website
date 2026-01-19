const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

/**
 * Protected Routes - All cart operations require JWT authentication
 */

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, getCart);

// @route   POST /api/cart/add
// @desc    Add product to cart
// @access  Private
router.post('/add', protect, addToCart);

// @route   PUT /api/cart/update/:itemId
// @desc    Update item quantity in cart
// @access  Private
router.put('/update/:itemId', protect, updateCartItem);

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', protect, removeFromCart);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, clearCart);

module.exports = router;
