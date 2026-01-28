const User = require('../models/User');

/**
 * Admin Authorization Middleware
 * Checks if user has admin role
 * Must be used AFTER protect middleware
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get user ID from request (set by protect middleware)
    const userId = req.userId;

    // Fetch user from database
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message:
          'You do not have permission to access this resource. Admin access required.',
      });
    }

    // User is admin, proceed
    req.user = user; // Update user info with fresh data
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = adminAuth;
