const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Verifies token and attaches user info to request
 */
const protect = (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.slice(7); // Remove 'Bearer ' prefix
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message:
        'Not authorized to access this route. Please provide a valid token.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );

    // Attach user info to request
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired. Please refresh your token.',
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid or malformed token',
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Usage: authorize('admin'), authorize('admin', 'seller')
 */
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Find user in database
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          status: 'error',
          message: 'Your account has been deactivated',
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. Required role(s): ${allowedRoles.join(
            ', '
          )}`,
        });
      }

      // Attach user object to request for use in controllers
      req.user = user;

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Server error during authorization',
      });
    }
  };
};

module.exports = {
  protect,
  authorize,
};
