const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  refreshToken,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * Public Routes
 */

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh-token', refreshToken);

/**
 * Protected Routes
 */

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
