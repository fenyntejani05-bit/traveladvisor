const { body, param, query } = require('express-validator');
const DestinationService = require('../services/destinationService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Destination Controller
 * Handles search, filter by category, filter by state, and full CRUD.
 */

/**
 * GET /api/destinations
 * Get all destinations with optional search, state, category, and pagination.
 * Query params: search, state, category_id, page, limit
 */
const getAll = async (req, res, next) => {
  try {
    const { search, state, category_id, page, limit } = req.query;
    const result = await DestinationService.getAll({ search, state, category_id, page, limit });
    return successResponse(res, 'Destinations retrieved successfully.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/destinations/states
 * Get a list of distinct states for use in filter dropdowns.
 */
const getStates = async (req, res, next) => {
  try {
    const states = await DestinationService.getStates();
    return successResponse(res, 'States retrieved successfully.', { states });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/destinations/:id
 * Get a destination by ID.
 */
const getById = async (req, res, next) => {
  try {
    const destination = await DestinationService.getById(req.params.id);
    return successResponse(res, 'Destination retrieved successfully.', { destination });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/destinations
 * Create a new destination (admin only).
 * Supports optional image upload via multipart/form-data.
 */
const create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // If a file was uploaded, store its relative path
    if (req.file) {
      data.image = `/uploads/destinations/${req.file.filename}`;
    }

    const destination = await DestinationService.create(data);
    return successResponse(res, 'Destination created successfully.', { destination }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/destinations/:id
 * Update a destination (admin only).
 */
const update = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/destinations/${req.file.filename}`;
    }

    const destination = await DestinationService.update(req.params.id, data);
    return successResponse(res, 'Destination updated successfully.', { destination });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/destinations/:id
 * Delete a destination (admin only).
 */
const remove = async (req, res, next) => {
  try {
    await DestinationService.delete(req.params.id);
    return successResponse(res, 'Destination deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Validation Rules ─────────────────────────────────────────────────────────

const destinationValidation = [
  body('category_id')
    .notEmpty().withMessage('Category ID is required.')
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer.'),

  body('name')
    .trim()
    .notEmpty().withMessage('Destination name is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be 2–150 characters.'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required.')
    .isLength({ min: 2, max: 100 }).withMessage('State must be 2–100 characters.'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required.')
    .isLength({ min: 2, max: 100 }).withMessage('City must be 2–100 characters.'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),

  body('budget')
    .optional()
    .isFloat({ min: 0 }).withMessage('Budget must be a non-negative number.'),

  body('best_time_to_visit')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Best time to visit must be under 100 characters.'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5.'),
];

const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer.'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50.'),
  query('category_id').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer.'),
];

module.exports = {
  getAll,
  getStates,
  getById,
  create,
  update,
  remove,
  destinationValidation,
  idParamValidation,
  queryValidation,
};
