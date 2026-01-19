/**
 * Frontend validation utilities
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, uppercase, lowercase, number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone validation (10 digits)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Zip code validation (5-6 digits)
export const isValidZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{5,6}$/;
  return zipRegex.test(zipCode);
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  return value && (typeof value !== 'string' || value.trim().length > 0);
};

// Validate product form
export const validateProductForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.name)) errors.name = 'Product name is required';
  if (!isRequired(formData.description))
    errors.description = 'Description is required';
  if (!formData.price || formData.price <= 0)
    errors.price = 'Price must be greater than 0';
  if (!isRequired(formData.category)) errors.category = 'Category is required';
  if (formData.stock !== undefined && formData.stock < 0) {
    errors.stock = 'Stock cannot be negative';
  }

  return errors;
};

// Validate checkout form
export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.firstName))
    errors.firstName = 'First name is required';
  if (!isRequired(formData.lastName)) errors.lastName = 'Last name is required';
  if (!isRequired(formData.email)) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';

  if (!isRequired(formData.phone)) errors.phone = 'Phone number is required';
  else if (!isValidPhone(formData.phone)) errors.phone = 'Invalid phone number';

  if (!isRequired(formData.street))
    errors.street = 'Street address is required';
  if (!isRequired(formData.city)) errors.city = 'City is required';
  if (!isRequired(formData.state)) errors.state = 'State is required';
  if (!isRequired(formData.zipCode)) errors.zipCode = 'Zip code is required';
  else if (!isValidZipCode(formData.zipCode))
    errors.zipCode = 'Invalid zip code';

  return errors;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.email)) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';

  if (!isRequired(formData.password)) errors.password = 'Password is required';

  return errors;
};

// Validate register form
export const validateRegisterForm = (formData) => {
  const errors = { ...validateLoginForm(formData) };

  if (!isRequired(formData.name)) errors.name = 'Name is required';
  if (!isRequired(formData.confirmPassword)) {
    errors.confirmPassword = 'Please confirm password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (!isValidPassword(formData.password)) {
    errors.password =
      'Password must have: 8+ chars, uppercase, lowercase, number';
  }

  return errors;
};

export default {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidZipCode,
  isValidURL,
  isRequired,
  validateProductForm,
  validateCheckoutForm,
  validateLoginForm,
  validateRegisterForm,
};
