const cors = require('cors');

const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow localhost on any port during development
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL === origin) {
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
