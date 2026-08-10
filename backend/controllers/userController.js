const UserModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * User Controller (Admin-only operations)
 */

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    return successResponse(res, 'Users retrieved successfully.', {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }
    return successResponse(res, 'User retrieved successfully.', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting their own account
    if (parseInt(userId, 10) === req.user.id) {
      return errorResponse(res, 'Admin cannot delete their own account.', 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    await UserModel.delete(userId);
    return successResponse(res, 'User deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
};
