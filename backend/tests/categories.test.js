/**
 * Categories API Tests
 * Tests: GET all, GET by ID, POST (admin), PUT (admin), DELETE (admin)
 */

jest.mock('../config/db', () => ({
  query:          jest.fn(),
  pool:           { getConnection: jest.fn(), end: jest.fn() },
  testConnection: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');
const db      = require('../config/db');

// Generate a valid admin JWT for protected routes
const adminToken = jwt.sign(
  { id: 1, email: 'admin@traveladvisor.com', role: 'admin' },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: '1h' }
);

const mockCategory = {
  id: 1, category_name: 'Beach', description: 'Coastal destinations',
  created_at: new Date(), updated_at: new Date(),
};

afterEach(() => jest.clearAllMocks());

// =============================================================================
// GET /api/categories
// =============================================================================
describe('GET /api/categories', () => {
  it('should return all categories (200)', async () => {
    db.query.mockResolvedValueOnce([[mockCategory]]);

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.categories)).toBe(true);
  });
});

// =============================================================================
// GET /api/categories/:id
// =============================================================================
describe('GET /api/categories/:id', () => {
  it('should return a category by ID (200)', async () => {
    db.query.mockResolvedValueOnce([[mockCategory]]);

    const res = await request(app).get('/api/categories/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category.category_name).toBe('Beach');
  });

  it('should return 404 for non-existent category', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app).get('/api/categories/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid ID (non-integer)', async () => {
    const res = await request(app).get('/api/categories/abc');
    expect(res.statusCode).toBe(400);
  });
});

// =============================================================================
// POST /api/categories (admin only)
// =============================================================================
describe('POST /api/categories', () => {
  it('should create a category as admin (201)', async () => {
    db.query
      .mockResolvedValueOnce([[]])                    // findByName → not exists
      .mockResolvedValueOnce([{ insertId: 2 }])      // create
      .mockResolvedValueOnce([[{ ...mockCategory, id: 2, category_name: 'Hill Station' }]]); // findById

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category_name: 'Hill Station', description: 'Mountain destinations' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should return 403 for non-admin users', async () => {
    const userToken = jwt.sign(
      { id: 2, email: 'user@example.com', role: 'user' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ category_name: 'Hill Station' });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ category_name: 'Hill Station' });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 if category_name is missing', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Some description' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 409 if category already exists', async () => {
    db.query.mockResolvedValueOnce([[mockCategory]]); // findByName → exists

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category_name: 'Beach' });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

// =============================================================================
// PUT /api/categories/:id
// =============================================================================
describe('PUT /api/categories/:id', () => {
  it('should update a category as admin (200)', async () => {
    const updated = { ...mockCategory, category_name: 'Sea Beach' };

    db.query
      .mockResolvedValueOnce([[mockCategory]])   // findById (exists check)
      .mockResolvedValueOnce([[]])               // findByName → no conflict
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // update
      .mockResolvedValueOnce([[updated]]);       // findById (return updated)

    const res = await request(app)
      .put('/api/categories/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category_name: 'Sea Beach', description: 'Updated desc' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// =============================================================================
// DELETE /api/categories/:id
// =============================================================================
describe('DELETE /api/categories/:id', () => {
  it('should delete a category as admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockCategory]])       // findById
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // delete

    const res = await request(app)
      .delete('/api/categories/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should return 404 for non-existent category delete', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .delete('/api/categories/9999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
