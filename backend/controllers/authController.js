const { body } = require('express-validator');
const AuthService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Auth Controller
 * Thin layer — delegates all logic to AuthService.
 */

/**
 * POST /api/auth/register
 * Register a new user account.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await AuthService.register({ name, email, password, role });

    return successResponse(
      res,
      'Registration successful. Welcome to TravelAdvisor!',
      { user, token },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    return successResponse(res, 'Login successful.', { user, token });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/profile
 * Get the authenticated user's profile (requires valid JWT).
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    return successResponse(res, 'Profile retrieved successfully.', { user });
  } catch (err) {
    next(err);
  }
};

// ─── Validation Rules ─────────────────────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin".'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

module.exports = {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation,
};
