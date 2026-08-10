const { body, param, query } = require('express-validator');
const ReviewService = require('../services/reviewService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Review Controller
 */

/**
 * GET /api/reviews
 * Get all reviews (admin-only, paginated).
 */
const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await ReviewService.getAll({ page, limit });
    return successResponse(res, 'Reviews retrieved successfully.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reviews/destination/:destinationId
 * Get all reviews for a specific destination (public).
 */
const getByDestination = async (req, res, next) => {
  try {
    const reviews = await ReviewService.getByDestination(req.params.destinationId);
    return successResponse(res, 'Reviews retrieved successfully.', { reviews });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reviews
 * Submit a new review (authenticated users only).
 */
const create = async (req, res, next) => {
  try {
    const { destination_id, rating, review } = req.body;
    const newReview = await ReviewService.create({
      user_id: req.user.id,
      destination_id,
      rating,
      review,
    });
    return successResponse(res, 'Review submitted successfully.', { review: newReview }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reviews/:id
 * Update a review (owner or admin only).
 */
const update = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const updated = await ReviewService.update(
      req.params.id,
      { rating, review },
      req.user
    );
    return successResponse(res, 'Review updated successfully.', { review: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete a review (owner or admin only).
 */
const remove = async (req, res, next) => {
  try {
    await ReviewService.delete(req.params.id, req.user);
    return successResponse(res, 'Review deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Validation Rules ─────────────────────────────────────────────────────────

const reviewValidation = [
  body('destination_id')
    .notEmpty().withMessage('Destination ID is required.')
    .isInt({ min: 1 }).withMessage('Destination ID must be a positive integer.'),

  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),

  body('review')
    .trim()
    .notEmpty().withMessage('Review text is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Review must be between 10 and 2000 characters.'),
];

const reviewUpdateValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),

  body('review')
    .trim()
    .notEmpty().withMessage('Review text is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Review must be between 10 and 2000 characters.'),
];

const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer.'),
];

const destinationIdParamValidation = [
  param('destinationId')
    .isInt({ min: 1 }).withMessage('Destination ID must be a positive integer.'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50.'),
];

module.exports = {
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
};
