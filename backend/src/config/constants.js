// Backend Configuration Constants
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Payment Gateway Configuration
  STRIPE: {
    PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID,
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  },
  PAYPAL: {
    MODE: process.env.PAYPAL_MODE || 'sandbox',
    CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    SECRET: process.env.PAYPAL_SECRET,
  },

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },

  // Email Configuration
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    FROM: process.env.EMAIL_FROM,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },

  // Request Size Limits
  REQUEST_LIMIT: '10mb',

  // API Configuration
  API_VERSION: 'v1',

  // CORS Configuration
  CORS_OPTIONS: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};
