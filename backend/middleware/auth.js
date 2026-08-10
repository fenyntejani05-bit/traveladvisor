const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware: verifyToken
 * ─────────────────────────────────────────────────────────────────────────────
 * Extracts and verifies a Bearer JWT from the Authorization header.
 * On success, attaches decoded payload to `req.user` and calls next().
 * On failure, responds with 401 Unauthorized.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(
      res,
      'Access denied. No token provided. Please include "Authorization: Bearer <token>".',
      401
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Access denied. Token is malformed.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    // Pass to centralized error handler for JWT-specific messages
    next(err);
  }
};

/**
 * Middleware factory: authorizeRoles
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a middleware that restricts access to users whose role is in
 * the `...roles` list.
 *
 * Usage:
 *   router.delete('/:id', verifyToken, authorizeRoles('admin'), controller.delete);
 *
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'user')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access forbidden. This action requires one of the following roles: [${roles.join(', ')}].`,
        403
      );
    }

    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
