/**
 * Destinations API Tests
 * Tests: GET all, GET by ID, Search/Filter, POST, PUT, DELETE
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

const adminToken = jwt.sign(
  { id: 1, email: 'admin@traveladvisor.com', role: 'admin' },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: '1h' }
);

const mockDestination = {
  id: 1, name: 'Goa Beaches', state: 'Goa', city: 'Panaji',
  description: 'Beautiful beaches in Goa with vibrant nightlife.',
  image: null, budget: 3500.00, rating: 4.50,
  category_id: 1, category_name: 'Beach',
  created_at: new Date(), updated_at: new Date(),
};

afterEach(() => jest.clearAllMocks());

// =============================================================================
// GET /api/destinations
// =============================================================================
describe('GET /api/destinations', () => {
  it('should return paginated destinations (200)', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])          // count
      .mockResolvedValueOnce([[mockDestination]]);       // data

    const res = await request(app).get('/api/destinations');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.destinations)).toBe(true);
    expect(res.body.data).toHaveProperty('pagination');
  });

  it('should support search query param', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[mockDestination]]);

    const res = await request(app).get('/api/destinations?search=Goa');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should filter by state', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[mockDestination]]);

    const res = await request(app).get('/api/destinations?state=Goa');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should filter by category_id', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[mockDestination]]);

    const res = await request(app).get('/api/destinations?category_id=1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 400 for invalid page param', async () => {
    const res = await request(app).get('/api/destinations?page=-1');
    expect(res.statusCode).toBe(400);
  });
});

// =============================================================================
// GET /api/destinations/states
// =============================================================================
describe('GET /api/destinations/states', () => {
  it('should return list of states (200)', async () => {
    db.query.mockResolvedValueOnce([[{ state: 'Goa' }, { state: 'Rajasthan' }]]);

    const res = await request(app).get('/api/destinations/states');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.states)).toBe(true);
  });
});

// =============================================================================
// GET /api/destinations/:id
// =============================================================================
describe('GET /api/destinations/:id', () => {
  it('should return a destination by ID (200)', async () => {
    db.query.mockResolvedValueOnce([[mockDestination]]);

    const res = await request(app).get('/api/destinations/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.destination.name).toBe('Goa Beaches');
  });

  it('should return 404 for non-existent destination', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app).get('/api/destinations/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).get('/api/destinations/abc');
    expect(res.statusCode).toBe(400);
  });
});

// =============================================================================
// POST /api/destinations
// =============================================================================
describe('POST /api/destinations', () => {
  const newDest = {
    category_id: 1,
    name:        'Manali',
    state:       'Himachal Pradesh',
    city:        'Manali',
    description: 'A beautiful hill station in the Himalayas with snow-capped peaks.',
    budget:      4000,
    rating:      4.7,
  };

  it('should create a destination as admin (201)', async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1, category_name: 'Beach' }]])  // category findById
      .mockResolvedValueOnce([{ insertId: 5 }])                     // create
      .mockResolvedValueOnce([[{ ...mockDestination, id: 5, ...newDest }]]); // findById

    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newDest);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.destination).toHaveProperty('id');
  });

  it('should return 403 for non-admin users', async () => {
    const userToken = jwt.sign(
      { id: 2, email: 'user@example.com', role: 'user' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newDest);

    expect(res.statusCode).toBe(403);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 if rating is out of range', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newDest, rating: 10 });

    expect(res.statusCode).toBe(400);
  });
});

// =============================================================================
// PUT /api/destinations/:id
// =============================================================================
describe('PUT /api/destinations/:id', () => {
  it('should update a destination as admin (200)', async () => {
    const updated = { ...mockDestination, name: 'Updated Goa' };

    db.query
      .mockResolvedValueOnce([[mockDestination]])         // findById (exists)
      .mockResolvedValueOnce([[{ id: 1 }]])              // category findById
      .mockResolvedValueOnce([{ affectedRows: 1 }])      // update
      .mockResolvedValueOnce([[updated]]);               // findById (return updated)

    const res = await request(app)
      .put('/api/destinations/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...mockDestination, name: 'Updated Goa' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent destination', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .put('/api/destinations/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...mockDestination });

    expect(res.statusCode).toBe(404);
  });
});

// =============================================================================
// DELETE /api/destinations/:id
// =============================================================================
describe('DELETE /api/destinations/:id', () => {
  it('should delete a destination as admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockDestination]])        // findById
      .mockResolvedValueOnce([{ affectedRows: 1 }]);    // delete

    const res = await request(app)
      .delete('/api/destinations/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should return 404 for non-existent destination', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .delete('/api/destinations/9999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).delete('/api/destinations/1');
    expect(res.statusCode).toBe(401);
  });
});
