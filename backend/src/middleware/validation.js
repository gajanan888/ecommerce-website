/**
 * Validation utilities for request data
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (min 8 chars, uppercase, lowercase, number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 */
const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Validate required fields
 */
const validateRequired = (obj, fields) => {
  const missing = [];
  fields.forEach((field) => {
    if (!obj[field] || (typeof obj[field] === 'string' && !obj[field].trim())) {
      missing.push(field);
    }
  });
  return missing;
};

/**
 * Validate product data
 */
const validateProduct = (data) => {
  const errors = [];

  if (!data.name || !data.name.trim()) errors.push('Product name is required');
  if (!data.price || data.price <= 0)
    errors.push('Product price must be greater than 0');
  if (!data.description || !data.description.trim())
    errors.push('Product description is required');
  if (!data.category || !data.category.trim())
    errors.push('Product category is required');
  if (data.stock !== undefined && data.stock < 0)
    errors.push('Product stock cannot be negative');

  return errors;
};

/**
 * Validate order data
 */
const validateOrder = (data) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!data.shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    const missingFields = validateRequired(data.shippingAddress, addressFields);
    if (missingFields.length > 0) {
      errors.push(`Shipping address missing: ${missingFields.join(', ')}`);
    }
  }

  return errors;
};

/**
 * Sanitize user input to prevent XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim().substring(0, 500); // Limit length
};

/**
 * Sanitize object recursively
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRequired,
  validateProduct,
  validateOrder,
  sanitizeInput,
  sanitizeObject,
  EMAIL_REGEX,
  PASSWORD_REGEX,
};
