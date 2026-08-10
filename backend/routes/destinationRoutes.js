const express  = require('express');
const router   = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload   = require('../middleware/upload');
const {
  getAll,
  getStates,
  getById,
  create,
  update,
  remove,
  destinationValidation,
  idParamValidation,
  queryValidation,
} = require('../controllers/destinationController');

/**
 * @route   GET /api/destinations
 * @desc    Get all destinations (with optional search, state, category_id, page, limit)
 * @access  Public
 */
router.get('/', queryValidation, validate, getAll);

/**
 * @route   GET /api/destinations/states
 * @desc    Get distinct states for filter dropdown
 * @access  Public
 */
router.get('/states', getStates);

/**
 * @route   GET /api/destinations/:id
 * @desc    Get a destination by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, getById);

/**
 * @route   POST /api/destinations
 * @desc    Create a destination (supports image upload)
 * @access  Private (Admin only)
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('admin'),
  upload.single('image'),
  destinationValidation,
  validate,
  create
);

/**
 * @route   PUT /api/destinations/:id
 * @desc    Update a destination (supports image upload)
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  upload.single('image'),
  [...idParamValidation, ...destinationValidation],
  validate,
  update
);

/**
 * @route   DELETE /api/destinations/:id
 * @desc    Delete a destination
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, authorizeRoles('admin'), idParamValidation, validate, remove);

module.exports = router;
