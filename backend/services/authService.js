const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const SALT_ROUNDS = 10;

/**
 * Auth Service
 * Handles business logic for registration, login, token generation, and profile.
 */
const AuthService = {
  /**
   * Register a new user.
   * Hashes password, checks for duplicate email, returns new user + token.
   * @param {{ name, email, password, role? }} data
   * @returns {Promise<{ user, token }>}
   */
  register: async ({ name, email, password, role = 'user' }) => {
    // Prevent duplicate registration
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.statusCode = 409;
      throw err;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Persist user
    const userId = await UserModel.create({ name, email, password: hashedPassword, role });
    const user   = await UserModel.findById(userId);

    // Issue JWT
    const token = AuthService.generateToken(user);

    return { user, token };
  },

  /**
   * Authenticate an existing user.
   * @param {{ email, password }} credentials
   * @returns {Promise<{ user, token }>}
   */
  login: async ({ email, password }) => {
    // Look up user (including hashed password)
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Compare provided password against stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Return safe user object (no password)
    const safeUser = {
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      created_at: user.created_at,
    };

    const token = AuthService.generateToken(safeUser);
    return { user: safeUser, token };
  },

  /**
   * Retrieve the authenticated user's profile by ID.
   * @param {number} userId
   * @returns {Promise<object>}
   */
  getProfile: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },

  /**
   * Generate a signed JWT for a user.
   * @param {{ id, email, role }} user
   * @returns {string} Signed JWT
   */
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  },
};

module.exports = AuthService;
