const express  = require('express');
const router   = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getAll,
  getById,
  create,
  update,
  remove,
  categoryValidation,
  idParamValidation,
} = require('../controllers/categoryController');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAll);

/**
 * @route   GET /api/categories/:id
 * @desc    Get a category by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, getById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, authorizeRoles('admin'), categoryValidation, validate, create);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin only)
 */
router.put('/:id', verifyToken, authorizeRoles('admin'), [...idParamValidation, ...categoryValidation], validate, update);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, authorizeRoles('admin'), idParamValidation, validate, remove);

module.exports = router;
