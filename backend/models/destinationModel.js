const { query } = require('../config/db');

/**
 * Destination Model
 * Supports full-text search, filtering by state and category,
 * and standard CRUD operations — all with parameterized queries.
 */
const DestinationModel = {
  /**
   * Get all destinations with optional filters and search.
   * @param {{ search?, state?, category_id?, page?, limit? }} filters
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  findAll: async ({ search, state, category_id, page = 1, limit = 10 } = {}) => {
    const conditions = [];
    const params     = [];

    // Search across name, city, state, description
    if (search && search.trim()) {
      conditions.push(`(
        d.name        LIKE ? OR
        d.city        LIKE ? OR
        d.state       LIKE ? OR
        d.description LIKE ?
      )`);
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (state && state.trim()) {
      conditions.push('d.state = ?');
      params.push(state.trim());
    }

    if (category_id) {
      conditions.push('d.category_id = ?');
      params.push(Number(category_id));
    }

    const whereClause = conditions.length
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    // Count total matching records for pagination
    const countSql = `
      SELECT COUNT(*) AS total
      FROM destinations d
      ${whereClause}
    `;
    const [countRows] = await query(countSql, [...params]);
    const total = countRows[0].total;

    // Paginated result set
    const offset = (Number(page) - 1) * Number(limit);
    const dataSql = `
      SELECT
        d.id, d.name, d.state, d.city, d.description,
        d.image, d.budget, d.best_time_to_visit, d.rating, d.created_at, d.updated_at,
        c.id AS category_id, c.category_name
      FROM destinations d
      INNER JOIN categories c ON d.category_id = c.id
      ${whereClause}
      ORDER BY d.rating DESC, d.name ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await query(dataSql, [...params, Number(limit), offset]);
    return { rows, total };
  },

  /**
   * Find a destination by primary key.
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  findById: async (id) => {
    const sql = `
      SELECT
        d.id, d.name, d.state, d.city, d.description,
        d.image, d.budget, d.best_time_to_visit, d.rating, d.created_at, d.updated_at,
        c.id AS category_id, c.category_name, c.description AS category_description
      FROM destinations d
      INNER JOIN categories c ON d.category_id = c.id
      WHERE d.id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Create a new destination.
   * @param {{ category_id, name, state, city, description, image, budget, best_time_to_visit, rating }} data
   * @returns {Promise<number>} Inserted ID
   */
  create: async ({ category_id, name, state, city, description, image = null, budget = 0, best_time_to_visit = null, rating = 0 }) => {
    const sql = `
      INSERT INTO destinations (category_id, name, state, city, description, image, budget, best_time_to_visit, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await query(sql, [category_id, name, state, city, description, image, budget, best_time_to_visit, rating]);
    return result.insertId;
  },

  /**
   * Update an existing destination.
   * @param {number} id
   * @param {{ category_id, name, state, city, description, image, budget, best_time_to_visit, rating }} data
   * @returns {Promise<boolean>}
   */
  update: async (id, { category_id, name, state, city, description, image, budget, best_time_to_visit, rating }) => {
    const sql = `
      UPDATE destinations
      SET category_id = ?, name = ?, state = ?, city = ?,
          description = ?, image = ?, budget = ?, best_time_to_visit = ?, rating = ?
      WHERE id = ?
    `;
    const [result] = await query(sql, [category_id, name, state, city, description, image, budget, best_time_to_visit, rating, id]);
    return result.affectedRows > 0;
  },

  /**
   * Update only the rating of a destination (called after review changes).
   * @param {number} id
   * @param {number} rating
   * @returns {Promise<boolean>}
   */
  updateRating: async (id, rating) => {
    const [result] = await query(
      'UPDATE destinations SET rating = ? WHERE id = ?',
      [rating, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a destination by ID.
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    const [result] = await query('DELETE FROM destinations WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Get distinct states available in destinations (for filter dropdowns).
   * @returns {Promise<string[]>}
   */
  getStates: async () => {
    const [rows] = await query('SELECT DISTINCT state FROM destinations ORDER BY state ASC');
    return rows.map((r) => r.state);
  },
};

module.exports = DestinationModel;
