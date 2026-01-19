/**
 * Logger utility for consistent logging
 */

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
  SUCCESS: "SUCCESS",
};

/**
 * Format log message with timestamp and level
 */
const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const levelIcon =
    {
      ERROR: "❌",
      WARN: "⚠️",
      INFO: "ℹ️",
      DEBUG: "🐛",
      SUCCESS: "✅",
    }[level] || "📝";

  let output = `${levelIcon} [${timestamp}] [${level}] ${message}`;
  if (data) {
    output += "\n" + JSON.stringify(data, null, 2);
  }

  return output;
};

/**
 * Logger object
 */
const logger = {
  error: (message, data = null) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, data));
  },

  warn: (message, data = null) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
  },

  info: (message, data = null) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, data));
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },

  success: (message, data = null) => {
    console.log(formatLog(LOG_LEVELS.SUCCESS, message, data));
  },

  http: (method, path, status, duration = 0) => {
    const statusIcon =
      status >= 200 && status < 300 ? "✅" : status >= 400 ? "❌" : "⚠️";
    console.log(`${statusIcon} ${method} ${path} - ${status} (${duration}ms)`);
  },
};

module.exports = {
  logger,
  LOG_LEVELS,
  formatLog,
};
