const { query } = require('../config/db');

/**
 * User Model
 * All SQL queries are parameterized to prevent SQL Injection.
 */
const UserModel = {
  /**
   * Create a new user record.
   * @param {{ name, email, password, role }} userData
   * @returns {Promise<number>} Inserted user ID
   */
  create: async ({ name, email, password, role = 'user' }) => {
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await query(sql, [name, email, password, role]);
    return result.insertId;
  },

  /**
   * Find a user by email address.
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await query(sql, [email]);
    return rows[0] || null;
  },

  /**
   * Find a user by primary key.
   * @param {number} id
   * @returns {Promise<object|null>} User without password field
   */
  findById: async (id) => {
    const sql = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Retrieve all users (admin-only, excludes password).
   * @returns {Promise<Array>}
   */
  findAll: async () => {
    const sql = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    const [rows] = await query(sql);
    return rows;
  },

  /**
   * Update a user's profile fields.
   * @param {number} id
   * @param {{ name, email }} fields
   * @returns {Promise<boolean>}
   */
  update: async (id, { name, email }) => {
    const sql = `
      UPDATE users SET name = ?, email = ?
      WHERE id = ?
    `;
    const [result] = await query(sql, [name, email, id]);
    return result.affectedRows > 0;
  },

  /**
   * Update a user's hashed password.
   * @param {number} id
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  updatePassword: async (id, hashedPassword) => {
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await query(sql, [hashedPassword, id]);
    return result.affectedRows > 0;
  },

  /**
   * Delete a user by ID.
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    const [result] = await query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
