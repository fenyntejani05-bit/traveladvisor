const CategoryModel = require('../models/categoryModel');

/**
 * Category Service
 * Business logic layer for category management.
 */
const CategoryService = {
  /**
   * Retrieve all categories.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return CategoryModel.findAll();
  },

  /**
   * Retrieve a single category by ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  getById: async (id) => {
    const category = await CategoryModel.findById(id);
    if (!category) {
      const err = new Error(`Category with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return category;
  },

  /**
   * Create a new category.
   * Validates uniqueness of category_name.
   * @param {{ category_name, description? }} data
   * @returns {Promise<object>} Created category
   */
  create: async ({ category_name, description }) => {
    // Check for duplicates (case-insensitive)
    const existing = await CategoryModel.findByName(category_name);
    if (existing) {
      const err = new Error(`Category "${category_name}" already exists.`);
      err.statusCode = 409;
      throw err;
    }

    const id = await CategoryModel.create({ category_name, description });
    return CategoryModel.findById(id);
  },

  /**
   * Update an existing category.
   * @param {number} id
   * @param {{ category_name, description }} data
   * @returns {Promise<object>} Updated category
   */
  update: async (id, { category_name, description }) => {
    // Ensure category exists
    const existing = await CategoryModel.findById(id);
    if (!existing) {
      const err = new Error(`Category with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Check name collision with a different record
    const nameConflict = await CategoryModel.findByName(category_name);
    if (nameConflict && nameConflict.id !== Number(id)) {
      const err = new Error(`Category "${category_name}" already exists.`);
      err.statusCode = 409;
      throw err;
    }

    await CategoryModel.update(id, { category_name, description });
    return CategoryModel.findById(id);
  },

  /**
   * Delete a category by ID.
   * Will propagate FK constraint error if destinations reference it.
   * @param {number} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const existing = await CategoryModel.findById(id);
    if (!existing) {
      const err = new Error(`Category with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    await CategoryModel.delete(id);
  },
};

module.exports = CategoryService;
