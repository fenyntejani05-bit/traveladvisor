const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for an authenticated user
 * @param {number} id - User ID
 * @param {string} role - User Role ('user' | 'admin')
 * @returns {string} Signed JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_traveladvisor_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
