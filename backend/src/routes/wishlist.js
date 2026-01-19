const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/response');

// Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      'products',
      'name price images discount'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    return successResponse(res, 200, 'Wishlist fetched successfully', wishlist);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Add product to wishlist
router.post('/add/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    wishlist = await wishlist.populate(
      'products',
      'name price images discount'
    );
    return successResponse(res, 200, 'Product added to wishlist', wishlist);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return errorResponse(res, 404, 'Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    await wishlist.populate('products', 'name price images discount');
    return successResponse(res, 200, 'Product removed from wishlist', wishlist);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Clear wishlist
router.delete('/', protect, async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user.id }, { products: [] });
    return successResponse(res, 200, 'Wishlist cleared successfully', {});
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

module.exports = router;
