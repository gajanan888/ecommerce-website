const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} = require('../controllers/productController');

const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin routes (add auth middleware later)
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  createProduct
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
  updateProduct
);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
