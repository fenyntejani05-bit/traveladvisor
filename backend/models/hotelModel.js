const { query } = require('../config/db');

/**
 * Hotel Model
 * All queries are parameterized to prevent SQL Injection.
 */
const HotelModel = {
  /**
   * Get all hotels with destination info (paginated).
   * @param {{ page?, limit? }} opts
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  findAll: async ({ page = 1, limit = 10 } = {}) => {
    const [countRows] = await query('SELECT COUNT(*) AS total FROM hotels');
    const total  = countRows[0].total;
    const offset = (Number(page) - 1) * Number(limit);

    const sql = `
      SELECT
        h.id, h.hotel_name, h.location, h.price_per_night,
        h.rating, h.image, h.created_at, h.updated_at,
        d.id AS destination_id, d.name AS destination_name,
        d.city, d.state
      FROM hotels h
      INNER JOIN destinations d ON h.destination_id = d.id
      ORDER BY h.rating DESC, h.hotel_name ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await query(sql, [Number(limit), offset]);
    return { rows, total };
  },

  /**
   * Find a hotel by primary key.
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  findById: async (id) => {
    const sql = `
      SELECT
        h.id, h.hotel_name, h.location, h.price_per_night,
        h.rating, h.image, h.created_at, h.updated_at,
        d.id AS destination_id, d.name AS destination_name,
        d.city, d.state
      FROM hotels h
      INNER JOIN destinations d ON h.destination_id = d.id
      WHERE h.id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Get all hotels for a specific destination.
   * @param {number} destinationId
   * @returns {Promise<Array>}
   */
  findByDestination: async (destinationId) => {
    const sql = `
      SELECT
        h.id, h.hotel_name, h.location, h.price_per_night,
        h.rating, h.image, h.created_at, h.updated_at
      FROM hotels h
      WHERE h.destination_id = ?
      ORDER BY h.rating DESC, h.price_per_night ASC
    `;
    const [rows] = await query(sql, [Number(destinationId)]);
    return rows;
  },

  /**
   * Create a new hotel record.
   * @param {{ destination_id, hotel_name, location, price_per_night, rating, image }} data
   * @returns {Promise<number>} Inserted ID
   */
  create: async ({ destination_id, hotel_name, location, price_per_night, rating = 0, image = null }) => {
    const sql = `
      INSERT INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await query(sql, [destination_id, hotel_name, location, price_per_night, rating, image]);
    return result.insertId;
  },

  /**
   * Update an existing hotel.
   * @param {number} id
   * @param {{ destination_id, hotel_name, location, price_per_night, rating, image }} data
   * @returns {Promise<boolean>}
   */
  update: async (id, { destination_id, hotel_name, location, price_per_night, rating, image }) => {
    const sql = `
      UPDATE hotels
      SET destination_id = ?, hotel_name = ?, location = ?,
          price_per_night = ?, rating = ?, image = ?
      WHERE id = ?
    `;
    const [result] = await query(sql, [destination_id, hotel_name, location, price_per_night, rating, image, id]);
    return result.affectedRows > 0;
  },

  /**
   * Delete a hotel by ID.
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    const [result] = await query('DELETE FROM hotels WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = HotelModel;
