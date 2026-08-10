const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * MySQL Connection Pool Configuration
 * Supports both DATABASE_URL (cloud providers) and individual env vars
 */
let poolConfig;

if (process.env.DATABASE_URL) {
  // Cloud MySQL (Aiven, PlanetScale, Railway, etc.)
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    dateStrings: false,
    supportBigNumbers: true,
    bigNumberStrings: false,
    ssl: { rejectUnauthorized: false },
  };
} else {
  // Local development
  poolConfig = {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'travel_advisor_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: false,
    supportBigNumbers: true,
    bigNumberStrings: false,
  };
}

const pool = mysql2.createPool(poolConfig);

/**
 * Test the database connection once on startup.
 * Logs success or failure and rejects the process on fatal errors.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅  MySQL Database connected successfully');
    console.log(`    Host: ${process.env.DB_HOST || 'localhost'} | DB: ${process.env.DB_NAME}`);
    connection.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    // Allow app to start even without DB (for testing with mocks)
  }
};

/**
 * Execute a parameterized query against the pool.
 * @param {string} sql  - SQL statement with `?` placeholders
 * @param {Array}  params - Bound parameters
 * @returns {Promise<[rows, fields]>}
 */
const query = async (sql, params = []) => {
  return pool.execute(sql, params);
};

module.exports = { pool, query, testConnection };
