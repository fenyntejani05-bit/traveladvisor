const express = require('express');
const router  = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/userController');

// All user management routes require admin privileges
router.use(verifyToken);
router.use(authorizeRoles('admin'));

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID (Admin only)
 * @access  Private/Admin
 */
router.get('/:id', getUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', deleteUser);

module.exports = router;
