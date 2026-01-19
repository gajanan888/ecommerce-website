const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
} = require('../controllers/adminProductController');
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateTrackingNumber,
  getOrderStats,
} = require('../controllers/adminOrderController');

// Protect all admin routes
router.use(protect, adminAuth);

// ========== DASHBOARD ==========
router.get('/dashboard/stats', adminController.getDashboardStats);

// ========== PRODUCT MANAGEMENT ==========
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/bulk/update', bulkUpdateProducts);

// ========== ORDERS MANAGEMENT ==========
router.get('/orders', getAllOrders);
router.get('/orders/stats/summary', getOrderStats);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/payment-status', updatePaymentStatus);
router.put('/orders/:id/tracking', updateTrackingNumber);

// ========== PAYMENTS TRACKING ==========
router.get('/payments/stats', adminController.getPaymentStats);

// ========== USERS MANAGEMENT ==========
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/toggle-active', adminController.toggleUserActive);

// ========== DISCOUNTS & OFFERS ==========
router.get('/discounts', adminController.getAllDiscounts);
router.post('/discounts', adminController.createDiscount);
router.put('/discounts/:id', adminController.updateDiscount);
router.delete('/discounts/:id', adminController.deleteDiscount);
router.put(
  '/discounts/:id/toggle-active',
  adminController.toggleDiscountActive
);

module.exports = router;
