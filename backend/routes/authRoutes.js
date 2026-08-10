const express  = require('express');
const router   = express.Router();
const { verifyToken } = require('../middleware/auth');
const validate        = require('../middleware/validate');
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and receive JWT
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user's profile
 * @access  Private (requires JWT)
 */
router.get('/profile', verifyToken, getProfile);

module.exports = router;
