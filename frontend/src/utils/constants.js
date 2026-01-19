/**
 * Frontend utility constants
 */

// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Payment Gateway Keys
export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
export const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  CART: "cart",
  WISHLIST: "wishlist",
  THEME: "theme",
  LANGUAGE: "language",
  RECENT_PRODUCTS: "recentProducts",
};

// Product Categories
export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Food",
  "Toys",
];

// Sort Options
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rating" },
  { value: "popular", label: "Most Popular" },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "Please login to continue.",
  FORBIDDEN: "You do not have permission to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  REGISTER_SUCCESS: "Account created successfully!",
  PRODUCT_ADDED: "Product added to cart!",
  PRODUCT_REMOVED: "Product removed from cart!",
  ORDER_PLACED: "Order placed successfully!",
  PAYMENT_SUCCESS: "Payment successful!",
};

// API Timeout (ms)
export const API_TIMEOUT = 30000;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 5;

// Image Dimensions
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 100, height: 100 },
  SMALL: { width: 200, height: 200 },
  MEDIUM: { width: 400, height: 400 },
  LARGE: { width: 800, height: 800 },
};

// Date Formats
export const DATE_FORMAT = "MMM DD, YYYY";
export const DATETIME_FORMAT = "MMM DD, YYYY HH:mm";

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  ZIP_CODE: /^[0-9]{5,6}$/,
  URL: /^https?:\/\/.+/,
};
