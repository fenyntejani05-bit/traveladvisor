const { body, param, query } = require('express-validator');
const HotelService = require('../services/hotelService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Hotel Controller
 */

/**
 * GET /api/hotels
 * Get all hotels (paginated).
 */
const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await HotelService.getAll({ page, limit });
    return successResponse(res, 'Hotels retrieved successfully.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hotels/:id
 * Get a single hotel by ID.
 */
const getById = async (req, res, next) => {
  try {
    const hotel = await HotelService.getById(req.params.id);
    return successResponse(res, 'Hotel retrieved successfully.', { hotel });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hotels/destination/:destinationId
 * Get all hotels for a specific destination.
 */
const getByDestination = async (req, res, next) => {
  try {
    const result = await HotelService.getByDestination(req.params.destinationId);
    return successResponse(res, 'Hotels for destination retrieved successfully.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hotels
 * Create a new hotel (admin only).
 */
const create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/hotels/${req.file.filename}`;
    }

    const hotel = await HotelService.create(data);
    return successResponse(res, 'Hotel created successfully.', { hotel }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/hotels/:id
 * Update a hotel (admin only).
 */
const update = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/hotels/${req.file.filename}`;
    }

    const hotel = await HotelService.update(req.params.id, data);
    return successResponse(res, 'Hotel updated successfully.', { hotel });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/hotels/:id
 * Delete a hotel (admin only).
 */
const remove = async (req, res, next) => {
  try {
    await HotelService.delete(req.params.id);
    return successResponse(res, 'Hotel deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Validation Rules ─────────────────────────────────────────────────────────

const hotelValidation = [
  body('destination_id')
    .notEmpty().withMessage('Destination ID is required.')
    .isInt({ min: 1 }).withMessage('Destination ID must be a positive integer.'),

  body('hotel_name')
    .trim()
    .notEmpty().withMessage('Hotel name is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Hotel name must be 2–150 characters.'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.')
    .isLength({ min: 2, max: 255 }).withMessage('Location must be 2–255 characters.'),

  body('price_per_night')
    .notEmpty().withMessage('Price per night is required.')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5.'),
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
  getById,
  getByDestination,
  create,
  update,
  remove,
  hotelValidation,
  idParamValidation,
  destinationIdParamValidation,
  queryValidation,
};
