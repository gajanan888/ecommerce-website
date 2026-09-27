const requiredProductionVariables = [
  'MONGODB_URI',
  'FRONTEND_URL',
  'JWT_SECRET',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'CLOUD_NAME',
  'CLOUD_KEY',
  'CLOUD_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

const validateProductionEnv = () => {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = requiredProductionVariables.filter(
    (name) => !process.env[name] || process.env[name].startsWith('your_')
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing production environment variables: ${missing.join(', ')}`
    );
  }
};

module.exports = validateProductionEnv;
