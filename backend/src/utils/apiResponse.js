/**
 * Standard API response helper for consistent JSON payloads
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    timestamp: new Date().toISOString(),
    ...(data !== null && { data }),
  });
};

module.exports = { sendResponse };
