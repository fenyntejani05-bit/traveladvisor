const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware: validate
 * ─────────────────────────────────────────────────────────────────────────────
 * Collects validation errors from express-validator's `validationResult`.
 * If errors exist, responds 400 with formatted error array and stops pipeline.
 * Otherwise calls next().
 *
 * Usage: Place after express-validator chains in route definitions.
 * Example:
 *   router.post('/', [body('email').isEmail(), validate], controller.create);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map errors to a clean array of { field, message }
    const formattedErrors = errors.array().map((err) => ({
      field:   err.path || err.param || 'unknown',
      message: err.msg,
    }));

    return errorResponse(res, 'Validation failed', 400, formattedErrors);
  }

  next();
};

module.exports = validate;
