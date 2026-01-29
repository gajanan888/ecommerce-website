/**
 * Response utility for consistent API responses
 */

/**
 * Success response
 */
const successResponse = (data, message = 'Success', status = 200) => {
  return {
    success: true,
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Paginated response
 */
const paginatedResponse = (data, total, page, limit, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Error response
 */
const errorResponse = (message, status = 500, details = null) => {
  return {
    success: false,
    status,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
