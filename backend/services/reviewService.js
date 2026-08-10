const ReviewModel      = require('../models/reviewModel');
const DestinationModel = require('../models/destinationModel');

/**
 * Review Service
 * Business logic for reviews, authorization checks, and rating sync.
 */
const ReviewService = {
  /**
   * Get all reviews for a specific destination.
   * @param {number} destinationId
   * @returns {Promise<Array>}
   */
  getByDestination: async (destinationId) => {
    const destination = await DestinationModel.findById(destinationId);
    if (!destination) {
      const err = new Error(`Destination with ID ${destinationId} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return ReviewModel.findByDestination(destinationId);
  },

  /**
   * Get all reviews (admin paginated view).
   * @param {{ page?, limit? }} opts
   * @returns {Promise<{ reviews, pagination }>}
   */
  getAll: async ({ page = 1, limit = 10 } = {}) => {
    const p = Math.max(1, parseInt(page));
    const l = Math.min(50, Math.max(1, parseInt(limit)));

    const { rows, total } = await ReviewModel.findAll({ page: p, limit: l });

    return {
      reviews: rows,
      pagination: {
        total,
        page:        p,
        limit:       l,
        totalPages:  Math.ceil(total / l),
        hasNextPage: p * l < total,
        hasPrevPage: p > 1,
      },
    };
  },

  /**
   * Post a new review for a destination.
   * Syncs the destination's average rating afterwards.
   * @param {{ user_id, destination_id, rating, review }} data
   * @returns {Promise<object>} Created review
   */
  create: async ({ user_id, destination_id, rating, review }) => {
    // Validate destination exists
    const destination = await DestinationModel.findById(destination_id);
    if (!destination) {
      const err = new Error(`Destination with ID ${destination_id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const id = await ReviewModel.create({ user_id, destination_id, rating, review });

    // Sync destination average rating
    await ReviewService._syncDestinationRating(destination_id);

    return ReviewModel.findById(id);
  },

  /**
   * Update a review.
   * Only the review owner or an admin may edit.
   * @param {number} id        - Review ID
   * @param {{ rating, review }} data
   * @param {{ id, role }}   requestingUser
   * @returns {Promise<object>} Updated review
   */
  update: async (id, { rating, review }, requestingUser) => {
    const existing = await ReviewModel.findById(id);
    if (!existing) {
      const err = new Error(`Review with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Authorization: owner or admin only
    if (existing.user_id !== requestingUser.id && requestingUser.role !== 'admin') {
      const err = new Error('You are not authorized to edit this review.');
      err.statusCode = 403;
      throw err;
    }

    await ReviewModel.update(id, { rating, review });

    // Sync destination average rating
    await ReviewService._syncDestinationRating(existing.destination_id);

    return ReviewModel.findById(id);
  },

  /**
   * Delete a review.
   * Only the review owner or an admin may delete.
   * @param {number} id
   * @param {{ id, role }} requestingUser
   * @returns {Promise<void>}
   */
  delete: async (id, requestingUser) => {
    const existing = await ReviewModel.findById(id);
    if (!existing) {
      const err = new Error(`Review with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Authorization: owner or admin only
    if (existing.user_id !== requestingUser.id && requestingUser.role !== 'admin') {
      const err = new Error('You are not authorized to delete this review.');
      err.statusCode = 403;
      throw err;
    }

    const destinationId = existing.destination_id;
    await ReviewModel.delete(id);

    // Sync destination average rating after deletion
    await ReviewService._syncDestinationRating(destinationId);
  },

  /**
   * Internal helper: recalculates and persists the average rating for a destination.
   * @param {number} destinationId
   * @private
   */
  _syncDestinationRating: async (destinationId) => {
    const avgRating = await ReviewModel.getAverageRating(destinationId);
    await DestinationModel.updateRating(destinationId, avgRating);
  },
};

module.exports = ReviewService;
