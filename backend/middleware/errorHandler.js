const { errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Centralized Express error-handling middleware.
 * Must be registered LAST (after all routes) in app.js with 4 parameters.
 *
 * Handles common HTTP error codes and maps them to structured JSON responses.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log structured error
  logger.error(err.message || 'Server error', {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // ─── JWT Errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token has expired. Please log in again.', 401);
  }
  if (err.name === 'NotBeforeError') {
    return errorResponse(res, 'Token not yet valid.', 401);
  }

  // ─── MySQL Errors ─────────────────────────────────────────────────────────
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 'A record with this value already exists.', 409);
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Referenced record does not exist.', 400);
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return errorResponse(
      res,
      'Cannot delete — this record is referenced by other data.',
      409
    );
  }

  // ─── Multer File Upload Errors ────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large. Maximum upload size is 5MB.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return errorResponse(res, 'Unexpected file field in upload request.', 400);
  }

  // ─── Custom Application Errors ────────────────────────────────────────────
  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // ─── Default 500 Internal Server Error ───────────────────────────────────
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error. Please try again later.'
      : err.message || 'Internal server error.',
    500
  );
};

module.exports = errorHandler;
