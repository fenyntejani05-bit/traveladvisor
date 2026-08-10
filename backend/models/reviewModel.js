const { query } = require('../config/db');

/**
 * Review Model
 * Parameterized queries; includes rating recalculation helper.
 */
const ReviewModel = {
  /**
   * Get all reviews for a destination (with reviewer name).
   * @param {number} destinationId
   * @returns {Promise<Array>}
   */
  findByDestination: async (destinationId) => {
    const sql = `
      SELECT
        r.id, r.rating, r.review, r.created_at, r.updated_at,
        u.id AS user_id, u.name AS reviewer_name,
        d.id AS destination_id, d.name AS destination_name
      FROM reviews r
      INNER JOIN users       u ON r.user_id        = u.id
      INNER JOIN destinations d ON r.destination_id = d.id
      WHERE r.destination_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await query(sql, [Number(destinationId)]);
    return rows;
  },

  /**
   * Get all reviews (admin view), paginated.
   * @param {{ page?, limit? }} opts
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  findAll: async ({ page = 1, limit = 10 } = {}) => {
    const [countRows] = await query('SELECT COUNT(*) AS total FROM reviews');
    const total  = countRows[0].total;
    const offset = (Number(page) - 1) * Number(limit);

    const sql = `
      SELECT
        r.id, r.rating, r.review, r.created_at, r.updated_at,
        u.id AS user_id, u.name AS reviewer_name,
        d.id AS destination_id, d.name AS destination_name
      FROM reviews r
      INNER JOIN users        u ON r.user_id        = u.id
      INNER JOIN destinations d ON r.destination_id = d.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await query(sql, [Number(limit), offset]);
    return { rows, total };
  },

  /**
   * Find a single review by primary key.
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  findById: async (id) => {
    const sql = `
      SELECT
        r.id, r.user_id, r.destination_id, r.rating, r.review,
        r.created_at, r.updated_at,
        u.name AS reviewer_name
      FROM reviews r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Create a new review.
   * @param {{ user_id, destination_id, rating, review }} data
   * @returns {Promise<number>} Inserted ID
   */
  create: async ({ user_id, destination_id, rating, review }) => {
    const sql = `
      INSERT INTO reviews (user_id, destination_id, rating, review)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await query(sql, [user_id, destination_id, rating, review]);
    return result.insertId;
  },

  /**
   * Update an existing review.
   * @param {number} id
   * @param {{ rating, review }} data
   * @returns {Promise<boolean>}
   */
  update: async (id, { rating, review }) => {
    const sql = `
      UPDATE reviews
      SET rating = ?, review = ?
      WHERE id = ?
    `;
    const [result] = await query(sql, [rating, review, id]);
    return result.affectedRows > 0;
  },

  /**
   * Delete a review by ID.
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    const [result] = await query('DELETE FROM reviews WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Calculate the average rating for a destination from all its reviews.
   * Used to keep destinations.rating in sync after review changes.
   * @param {number} destinationId
   * @returns {Promise<number>} Average rating (0 if no reviews)
   */
  getAverageRating: async (destinationId) => {
    const [rows] = await query(
      'SELECT ROUND(AVG(rating), 2) AS avg_rating FROM reviews WHERE destination_id = ?',
      [Number(destinationId)]
    );
    return parseFloat(rows[0].avg_rating) || 0;
  },
};

module.exports = ReviewModel;
