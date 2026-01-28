const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  updateShippingAddress,
  confirmCODOrder,
} = require('../controllers/orderController');

/**
 * Protected Routes - All require JWT authentication
 */

// @route   POST /api/orders
// @desc    Place an order from cart
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/address
// @desc    Update shipping address
// @access  Private
router.put('/:id/address', protect, updateShippingAddress);

// @route   PUT /api/orders/:id/confirm-cod
// @desc    Confirm COD order
// @access  Private
router.put('/:id/confirm-cod', protect, confirmCODOrder);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateOrder);

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', protect, cancelOrder);

module.exports = router;
