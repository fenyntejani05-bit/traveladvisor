const DestinationModel = require('../models/destinationModel');
const CategoryModel    = require('../models/categoryModel');

/**
 * Destination Service
 * Business logic for destination search, filtering, CRUD, and pagination.
 */
const DestinationService = {
  /**
   * Get destinations with optional search, state, category filters and pagination.
   * @param {{ search?, state?, category_id?, page?, limit? }} filters
   * @returns {Promise<{ destinations, pagination }>}
   */
  getAll: async (filters = {}) => {
    const page  = Math.max(1, parseInt(filters.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10));

    const { rows, total } = await DestinationModel.findAll({ ...filters, page, limit });

    return {
      destinations: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Get available states for filter UI.
   * @returns {Promise<string[]>}
   */
  getStates: async () => {
    return DestinationModel.getStates();
  },

  /**
   * Get a destination by ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  getById: async (id) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) {
      const err = new Error(`Destination with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return destination;
  },

  /**
   * Create a new destination.
   * Validates that the category_id exists.
   * @param {object} data
   * @returns {Promise<object>} Created destination
   */
  create: async (data) => {
    // Validate category exists
    const category = await CategoryModel.findById(data.category_id);
    if (!category) {
      const err = new Error(`Category with ID ${data.category_id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const id = await DestinationModel.create(data);
    return DestinationModel.findById(id);
  },

  /**
   * Update a destination.
   * @param {number} id
   * @param {object} data
   * @returns {Promise<object>} Updated destination
   */
  update: async (id, data) => {
    const existing = await DestinationModel.findById(id);
    if (!existing) {
      const err = new Error(`Destination with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Validate category exists if changed
    if (data.category_id) {
      const category = await CategoryModel.findById(data.category_id);
      if (!category) {
        const err = new Error(`Category with ID ${data.category_id} not found.`);
        err.statusCode = 404;
        throw err;
      }
    }

    // Merge existing values with incoming updates
    const merged = {
      category_id:  data.category_id  ?? existing.category_id,
      name:         data.name         ?? existing.name,
      state:        data.state        ?? existing.state,
      city:         data.city         ?? existing.city,
      description:  data.description  ?? existing.description,
      image:        data.image        !== undefined ? data.image : existing.image,
      budget:       data.budget       ?? existing.budget,
      best_time_to_visit: data.best_time_to_visit ?? existing.best_time_to_visit,
      rating:       data.rating       ?? existing.rating,
    };

    await DestinationModel.update(id, merged);
    return DestinationModel.findById(id);
  },

  /**
   * Delete a destination by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const existing = await DestinationModel.findById(id);
    if (!existing) {
      const err = new Error(`Destination with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    await DestinationModel.delete(id);
  },
};

module.exports = DestinationService;
