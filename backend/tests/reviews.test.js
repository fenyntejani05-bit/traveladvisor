/**
 * Reviews API Tests
 * Tests: GET by destination (public), GET all (admin), POST, PUT, DELETE
 *        Authorization checks (owner vs admin vs unauthorized)
 *
 * Uses a mock DB so tests run without a live MySQL connection.
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

// ─── JWT tokens for different roles ────────────────────────────────────────────
const SECRET = process.env.JWT_SECRET || 'fallback_secret';

const adminToken = jwt.sign(
  { id: 1, email: 'admin@traveladvisor.com', role: 'admin' },
  SECRET,
  { expiresIn: '1h' }
);

const userToken = jwt.sign(
  { id: 2, email: 'priya@example.com', role: 'user' },
  SECRET,
  { expiresIn: '1h' }
);

const otherUserToken = jwt.sign(
  { id: 3, email: 'rahul@example.com', role: 'user' },
  SECRET,
  { expiresIn: '1h' }
);

// ─── Mock data ─────────────────────────────────────────────────────────────────
const mockReview = {
  id: 1, user_id: 2, destination_id: 1,
  rating: 5, review: 'Goa is absolutely magical! The beaches are stunning.',
  reviewer_name: 'Priya Sharma',
  destination_name: 'Goa Beaches',
  created_at: new Date(), updated_at: new Date(),
};

const mockDestination = {
  id: 1, name: 'Goa Beaches', state: 'Goa', city: 'Panaji',
  description: 'Beautiful beaches in Goa.',
  category_id: 1, category_name: 'Beach',
};

afterEach(() => jest.clearAllMocks());

// =============================================================================
// GET /api/reviews/destination/:destinationId
// =============================================================================
describe('GET /api/reviews/destination/:destinationId', () => {
  it('should return reviews for a valid destination (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockDestination]])   // destination findById
      .mockResolvedValueOnce([[mockReview]]);        // reviews findByDestination

    const res = await request(app).get('/api/reviews/destination/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
    expect(res.body.data.reviews[0]).toHaveProperty('rating');
  });

  it('should return 404 for non-existent destination', async () => {
    db.query.mockResolvedValueOnce([[]]); // destination not found

    const res = await request(app).get('/api/reviews/destination/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid destination ID', async () => {
    const res = await request(app).get('/api/reviews/destination/abc');
    expect(res.statusCode).toBe(400);
  });
});

// =============================================================================
// GET /api/reviews (admin only)
// =============================================================================
describe('GET /api/reviews', () => {
  it('should return paginated reviews for admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])  // count
      .mockResolvedValueOnce([[mockReview]]);    // data

    const res = await request(app)
      .get('/api/reviews')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
    expect(res.body.data).toHaveProperty('pagination');
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .get('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/reviews');
    expect(res.statusCode).toBe(401);
  });
});

// =============================================================================
// POST /api/reviews
// =============================================================================
describe('POST /api/reviews', () => {
  const newReview = {
    destination_id: 1,
    rating:         5,
    review:         'Amazing place! Absolutely loved every moment of our trip.',
  };

  it('should create a review as authenticated user (201)', async () => {
    db.query
      .mockResolvedValueOnce([[mockDestination]])      // destination findById (validation)
      .mockResolvedValueOnce([{ insertId: 10 }])       // create
      .mockResolvedValueOnce([[{ total: 5 }]])         // getAverageRating (AVG query)
      .mockResolvedValueOnce([{ affectedRows: 1 }])    // updateRating
      .mockResolvedValueOnce([[{                        // findById (return created)
        ...mockReview, id: 10, ...newReview,
      }]]);

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newReview);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.review).toHaveProperty('id');
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send(newReview);

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ rating: 5 }); // missing destination_id and review

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 if rating is out of range', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...newReview, rating: 10 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if review text is too short', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...newReview, review: 'Short' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if destination does not exist', async () => {
    db.query.mockResolvedValueOnce([[]]); // destination not found

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...newReview, destination_id: 9999 });

    expect(res.statusCode).toBe(404);
  });
});

// =============================================================================
// PUT /api/reviews/:id
// =============================================================================
describe('PUT /api/reviews/:id', () => {
  const updateData = {
    rating: 4,
    review: 'Updated review text — still a great destination, would visit again!',
  };

  it('should update a review as the owner (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockReview]])            // findById (exists, user_id=2)
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // update
      .mockResolvedValueOnce([[{ total: 4.5 }]])        // getAverageRating
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // updateRating
      .mockResolvedValueOnce([[{ ...mockReview, ...updateData }]]); // findById (return)

    const res = await request(app)
      .put('/api/reviews/1')
      .set('Authorization', `Bearer ${userToken}`)       // user_id=2 = owner
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should update a review as admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockReview]])            // findById
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // update
      .mockResolvedValueOnce([[{ total: 4.5 }]])        // getAverageRating
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // updateRating
      .mockResolvedValueOnce([[{ ...mockReview, ...updateData }]]); // findById

    const res = await request(app)
      .put('/api/reviews/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 403 for a non-owner, non-admin user', async () => {
    db.query.mockResolvedValueOnce([[mockReview]]); // findById (user_id=2, not 3)

    const res = await request(app)
      .put('/api/reviews/1')
      .set('Authorization', `Bearer ${otherUserToken}`) // user_id=3
      .send(updateData);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent review', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .put('/api/reviews/9999')
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .put('/api/reviews/1')
      .send(updateData);

    expect(res.statusCode).toBe(401);
  });
});

// =============================================================================
// DELETE /api/reviews/:id
// =============================================================================
describe('DELETE /api/reviews/:id', () => {
  it('should delete a review as the owner (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockReview]])            // findById (user_id=2)
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // delete
      .mockResolvedValueOnce([[{ total: 4.0 }]])        // getAverageRating
      .mockResolvedValueOnce([{ affectedRows: 1 }]);    // updateRating

    const res = await request(app)
      .delete('/api/reviews/1')
      .set('Authorization', `Bearer ${userToken}`);      // user_id=2 = owner

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should delete a review as admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockReview]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ total: 4.0 }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete('/api/reviews/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 403 for a non-owner, non-admin user', async () => {
    db.query.mockResolvedValueOnce([[mockReview]]); // findById (user_id=2)

    const res = await request(app)
      .delete('/api/reviews/1')
      .set('Authorization', `Bearer ${otherUserToken}`); // user_id=3

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent review', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .delete('/api/reviews/9999')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).delete('/api/reviews/1');
    expect(res.statusCode).toBe(401);
  });
});
