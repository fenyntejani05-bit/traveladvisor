/**
 * Standardized API response helpers.
 * Ensures all API responses follow a consistent JSON structure.
 */

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable success message
 * @param {*}      data    - Payload to return (object, array, or null)
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const body = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
};

/**
 * Send an error JSON response.
 * @param {import('express').Response} res
 * @param {string} message   - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {*}      errors    - Optional validation errors or debug info
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const body = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};

module.exports = { successResponse, errorResponse };
