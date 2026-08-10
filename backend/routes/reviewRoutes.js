const express  = require('express');
const router   = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getAll,
  getByDestination,
  create,
  update,
  remove,
  reviewValidation,
  reviewUpdateValidation,
  idParamValidation,
  destinationIdParamValidation,
  queryValidation,
} = require('../controllers/reviewController');

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews (admin view, paginated)
 * @access  Private (Admin only)
 */
router.get('/', verifyToken, authorizeRoles('admin'), queryValidation, validate, getAll);

/**
 * @route   GET /api/reviews/destination/:destinationId
 * @desc    Get all reviews for a destination
 * @access  Public
 */
router.get('/destination/:destinationId', destinationIdParamValidation, validate, getByDestination);

/**
 * @route   POST /api/reviews
 * @desc    Submit a new review
 * @access  Private (Authenticated users)
 */
router.post('/', verifyToken, reviewValidation, validate, create);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review (owner or admin)
 * @access  Private
 */
router.put('/:id', verifyToken, [...idParamValidation, ...reviewUpdateValidation], validate, update);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review (owner or admin)
 * @access  Private
 */
router.delete('/:id', verifyToken, idParamValidation, validate, remove);

module.exports = router;
