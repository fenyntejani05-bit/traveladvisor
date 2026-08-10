const HotelModel       = require('../models/hotelModel');
const DestinationModel = require('../models/destinationModel');

/**
 * Hotel Service
 * Business logic for hotel management and destination-based lookups.
 */
const HotelService = {
  /**
   * Get all hotels (paginated).
   * @param {{ page?, limit? }} opts
   * @returns {Promise<{ hotels, pagination }>}
   */
  getAll: async ({ page = 1, limit = 10 } = {}) => {
    const p = Math.max(1, parseInt(page));
    const l = Math.min(50, Math.max(1, parseInt(limit)));

    const { rows, total } = await HotelModel.findAll({ page: p, limit: l });

    return {
      hotels: rows,
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
   * Get a hotel by ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  getById: async (id) => {
    const hotel = await HotelModel.findById(id);
    if (!hotel) {
      const err = new Error(`Hotel with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return hotel;
  },

  /**
   * Get all hotels for a destination.
   * @param {number} destinationId
   * @returns {Promise<Array>}
   */
  getByDestination: async (destinationId) => {
    // Verify destination exists
    const destination = await DestinationModel.findById(destinationId);
    if (!destination) {
      const err = new Error(`Destination with ID ${destinationId} not found.`);
      err.statusCode = 404;
      throw err;
    }
    const hotels = await HotelModel.findByDestination(destinationId);
    return { destination, hotels };
  },

  /**
   * Create a new hotel.
   * Validates that destination_id exists.
   * @param {object} data
   * @returns {Promise<object>} Created hotel
   */
  create: async (data) => {
    const destination = await DestinationModel.findById(data.destination_id);
    if (!destination) {
      const err = new Error(`Destination with ID ${data.destination_id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const id = await HotelModel.create(data);
    return HotelModel.findById(id);
  },

  /**
   * Update a hotel.
   * @param {number} id
   * @param {object} data
   * @returns {Promise<object>} Updated hotel
   */
  update: async (id, data) => {
    const existing = await HotelModel.findById(id);
    if (!existing) {
      const err = new Error(`Hotel with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Validate destination if being changed
    if (data.destination_id) {
      const dest = await DestinationModel.findById(data.destination_id);
      if (!dest) {
        const err = new Error(`Destination with ID ${data.destination_id} not found.`);
        err.statusCode = 404;
        throw err;
      }
    }

    const merged = {
      destination_id:  data.destination_id  ?? existing.destination_id,
      hotel_name:      data.hotel_name      ?? existing.hotel_name,
      location:        data.location        ?? existing.location,
      price_per_night: data.price_per_night ?? existing.price_per_night,
      rating:          data.rating          ?? existing.rating,
      image:           data.image           !== undefined ? data.image : existing.image,
    };

    await HotelModel.update(id, merged);
    return HotelModel.findById(id);
  },

  /**
   * Delete a hotel by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const existing = await HotelModel.findById(id);
    if (!existing) {
      const err = new Error(`Hotel with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    await HotelModel.delete(id);
  },
};

module.exports = HotelService;
