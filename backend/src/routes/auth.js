const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  refreshToken,
  getMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
} = require('../validators/auth.schema');

/**
 * Public Routes
 */

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validate(signupSchema), signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), login);

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

// @route   PUT /api/auth/update-password
// @desc    Update password
// @access  Private
router.put(
  '/update-password',
  protect,
  validate(updatePasswordSchema),
  updatePassword
);

module.exports = router;
