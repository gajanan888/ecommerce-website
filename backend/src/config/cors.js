const cors = require('cors');

const corsConfig = cors({
  origin: (origin, callback) => {
    const isDevelopmentOrigin =
      process.env.NODE_ENV !== 'production' &&
      (!origin || origin.includes('localhost') || origin.includes('127.0.0.1'));

    if (isDevelopmentOrigin || process.env.FRONTEND_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
});

module.exports = corsConfig;
