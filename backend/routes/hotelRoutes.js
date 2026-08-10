const express  = require('express');
const router   = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload   = require('../middleware/upload');
const {
  getAll,
  getById,
  getByDestination,
  create,
  update,
  remove,
  hotelValidation,
  idParamValidation,
  destinationIdParamValidation,
  queryValidation,
} = require('../controllers/hotelController');

/**
 * @route   GET /api/hotels
 * @desc    Get all hotels (paginated)
 * @access  Public
 */
router.get('/', queryValidation, validate, getAll);

/**
 * @route   GET /api/hotels/destination/:destinationId
 * @desc    Get hotels for a specific destination
 * @access  Public
 */
router.get('/destination/:destinationId', destinationIdParamValidation, validate, getByDestination);

/**
 * @route   GET /api/hotels/:id
 * @desc    Get a hotel by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, getById);

/**
 * @route   POST /api/hotels
 * @desc    Create a hotel (supports optional image upload)
 * @access  Private (Admin only)
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('admin'),
  upload.single('image'),
  hotelValidation,
  validate,
  create
);

/**
 * @route   PUT /api/hotels/:id
 * @desc    Update a hotel (supports optional image upload)
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  upload.single('image'),
  [...idParamValidation, ...hotelValidation],
  validate,
  update
);

/**
 * @route   DELETE /api/hotels/:id
 * @desc    Delete a hotel
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, authorizeRoles('admin'), idParamValidation, validate, remove);

module.exports = router;
