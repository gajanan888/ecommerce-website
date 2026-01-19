/**
 * Custom error handling middleware
 * Catches all errors and returns formatted response
 */

class APIError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.error(`❌ [${status}] ${message}`, {
    path: req.path,
    method: req.method,
    timestamp: err.timestamp || new Date().toISOString(),
  });

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err.details || null,
      }),
    },
  });
};

/**
 * Async handler wrapper to catch controller errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validation error
 */
class ValidationError extends APIError {
  constructor(message, details) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * Not found error
 */
class NotFoundError extends APIError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Unauthorized error
 */
class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

/**
 * Forbidden error
 */
class ForbiddenError extends APIError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

module.exports = {
  APIError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  errorHandler,
  asyncHandler,
};
