/**
 * Auth API Tests
 * Tests: Register, Login, Profile (JWT-protected)
 *
 * Uses a mock DB so tests run without a live MySQL connection.
 */

// ─── Mock the DB module ────────────────────────────────────────────────────────
jest.mock('../config/db', () => ({
  query:          jest.fn(),
  pool:           { getConnection: jest.fn(), end: jest.fn() },
  testConnection: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const bcrypt  = require('bcryptjs');
const app     = require('../app');
const db      = require('../config/db');

// ─── Shared test data ──────────────────────────────────────────────────────────
const validUser = {
  name:     'Test User',
  email:    'testuser@example.com',
  password: 'TestPass1',
};

let authToken = '';

// Hashed password for 'TestPass1'
let hashedPassword = '';

beforeAll(async () => {
  hashedPassword = await bcrypt.hash(validUser.password, 10);
});

afterEach(() => {
  jest.clearAllMocks();
});

// =============================================================================
// POST /api/auth/register
// =============================================================================
describe('POST /api/auth/register', () => {
  it('should register a new user successfully (201)', async () => {
    // First call: findByEmail → no existing user
    // Second call: INSERT → insertId
    // Third call:  findById → new user row
    db.query
      .mockResolvedValueOnce([[]])                                      // findByEmail
      .mockResolvedValueOnce([{ insertId: 99 }])                       // create
      .mockResolvedValueOnce([[{                                        // findById
        id: 99, name: validUser.name, email: validUser.email,
        role: 'user', created_at: new Date(), updated_at: new Date(),
      }]]);

    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it('should return 409 if email already exists', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, email: validUser.email }]]); // findByEmail

    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// =============================================================================
// POST /api/auth/login
// =============================================================================
describe('POST /api/auth/login', () => {
  it('should login with valid credentials (200)', async () => {
    db.query.mockResolvedValueOnce([[{
      id: 1, name: validUser.name, email: validUser.email,
      password: hashedPassword, role: 'user', created_at: new Date(),
    }]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    authToken = res.body.data.token; // save for profile test
  });

  it('should return 401 with wrong password', async () => {
    db.query.mockResolvedValueOnce([[{
      id: 1, name: validUser.name, email: validUser.email,
      password: hashedPassword, role: 'user',
    }]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'WrongPassword9' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 if user not found', async () => {
    db.query.mockResolvedValueOnce([[]]); // no user

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@example.com', password: 'TestPass1' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: validUser.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// =============================================================================
// GET /api/auth/profile
// =============================================================================
describe('GET /api/auth/profile', () => {
  it('should return profile for authenticated user', async () => {
    // First: login to get fresh token
    db.query.mockResolvedValueOnce([[{
      id: 1, name: validUser.name, email: validUser.email,
      password: hashedPassword, role: 'user',
    }]]);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    const token = loginRes.body.data?.token;
    expect(token).toBeDefined();

    // Then: profile call
    db.query.mockResolvedValueOnce([[{
      id: 1, name: validUser.name, email: validUser.email,
      role: 'user', created_at: new Date(), updated_at: new Date(),
    }]]);

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
