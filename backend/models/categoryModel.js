const { query } = require('../config/db');

/**
 * Category Model
 * All queries use parameterized statements to prevent SQL Injection.
 */
const CategoryModel = {
  /**
   * Get all categories ordered by name.
   * @returns {Promise<Array>}
   */
  findAll: async () => {
    const sql = `
      SELECT id, category_name, description, created_at, updated_at
      FROM categories
      ORDER BY category_name ASC
    `;
    const [rows] = await query(sql);
    return rows;
  },

  /**
   * Get a single category by primary key.
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  findById: async (id) => {
    const sql = `
      SELECT id, category_name, description, created_at, updated_at
      FROM categories
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Find a category by name (case-insensitive check).
   * @param {string} name
   * @returns {Promise<object|null>}
   */
  findByName: async (name) => {
    const sql = `
      SELECT id, category_name, description
      FROM categories
      WHERE LOWER(category_name) = LOWER(?)
      LIMIT 1
    `;
    const [rows] = await query(sql, [name]);
    return rows[0] || null;
  },

  /**
   * Create a new category.
   * @param {{ category_name, description }} data
   * @returns {Promise<number>} Inserted ID
   */
  create: async ({ category_name, description = null }) => {
    const sql = `
      INSERT INTO categories (category_name, description)
      VALUES (?, ?)
    `;
    const [result] = await query(sql, [category_name, description]);
    return result.insertId;
  },

  /**
   * Update an existing category.
   * @param {number} id
   * @param {{ category_name, description }} data
   * @returns {Promise<boolean>}
   */
  update: async (id, { category_name, description }) => {
    const sql = `
      UPDATE categories
      SET category_name = ?, description = ?
      WHERE id = ?
    `;
    const [result] = await query(sql, [category_name, description, id]);
    return result.affectedRows > 0;
  },

  /**
   * Delete a category by ID.
   * Will fail if destinations reference this category (FK constraint).
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    const [result] = await query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = CategoryModel;
