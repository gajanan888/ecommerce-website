const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/response');

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ product: productId });

    return successResponse(res, 200, 'Reviews fetched successfully', {
      reviews,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Add review for a product
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, 400, 'Rating must be between 1 and 5');
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return errorResponse(res, 400, 'You have already reviewed this product');
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      title,
      comment,
    });

    await review.populate('user', 'name');

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    return successResponse(res, 201, 'Review added successfully', review);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Update review
router.put('/:reviewId', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user.id) {
      return errorResponse(res, 403, 'Not authorized to update this review');
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return errorResponse(res, 400, 'Rating must be between 1 and 5');
      }
      review.rating = rating;
    }

    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('user', 'name');

    // Recalculate product rating
    const allReviews = await Review.find({ product: review.product });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(review.product, { rating: avgRating });

    return successResponse(res, 200, 'Review updated successfully', review);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

// Delete review
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this review');
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    return successResponse(res, 200, 'Review deleted successfully', {});
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
});

module.exports = router;
