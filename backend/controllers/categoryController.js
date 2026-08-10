const { body, param } = require('express-validator');
const CategoryService = require('../services/categoryService');
const { successResponse } = require('../utils/apiResponse');

/**
 * Category Controller
 */

/**
 * GET /api/categories
 * Retrieve all categories.
 */
const getAll = async (req, res, next) => {
  try {
    const categories = await CategoryService.getAll();
    return successResponse(res, 'Categories retrieved successfully.', { categories });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories/:id
 * Retrieve a single category by ID.
 */
const getById = async (req, res, next) => {
  try {
    const category = await CategoryService.getById(req.params.id);
    return successResponse(res, 'Category retrieved successfully.', { category });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/categories
 * Create a new category (admin only).
 */
const create = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    const category = await CategoryService.create({ category_name, description });
    return successResponse(res, 'Category created successfully.', { category }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/categories/:id
 * Update an existing category (admin only).
 */
const update = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    const category = await CategoryService.update(req.params.id, { category_name, description });
    return successResponse(res, 'Category updated successfully.', { category });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/categories/:id
 * Delete a category (admin only).
 */
const remove = async (req, res, next) => {
  try {
    await CategoryService.delete(req.params.id);
    return successResponse(res, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Validation Rules ─────────────────────────────────────────────────────────

const categoryValidation = [
  body('category_name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Category name must be 2–100 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters.'),
];

const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer.'),
];

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  categoryValidation,
  idParamValidation,
};
