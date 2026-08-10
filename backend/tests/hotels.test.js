/**
 * Hotels API Tests
 * Tests: GET all, GET by ID, GET by destination, POST, PUT, DELETE
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

const mockHotel = {
  id: 1, hotel_name: 'Taj Exotica', location: 'South Goa',
  price_per_night: 18000.00, rating: 4.80, image: null,
  destination_id: 1, destination_name: 'Goa Beaches',
  city: 'Panaji', state: 'Goa',
  created_at: new Date(), updated_at: new Date(),
};

afterEach(() => jest.clearAllMocks());

// =============================================================================
// GET /api/hotels
// =============================================================================
describe('GET /api/hotels', () => {
  it('should return paginated hotels (200)', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[mockHotel]]);

    const res = await request(app).get('/api/hotels');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.hotels)).toBe(true);
    expect(res.body.data).toHaveProperty('pagination');
  });
});

// =============================================================================
// GET /api/hotels/destination/:destinationId
// =============================================================================
describe('GET /api/hotels/destination/:destinationId', () => {
  it('should return hotels for a valid destination (200)', async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1, name: 'Goa Beaches' }]])  // destination findById
      .mockResolvedValueOnce([[mockHotel]]);                        // hotels by destination

    const res = await request(app).get('/api/hotels/destination/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.hotels)).toBe(true);
  });

  it('should return 404 for non-existent destination', async () => {
    db.query.mockResolvedValueOnce([[]]); // destination not found

    const res = await request(app).get('/api/hotels/destination/9999');
    expect(res.statusCode).toBe(404);
  });
});

// =============================================================================
// GET /api/hotels/:id
// =============================================================================
describe('GET /api/hotels/:id', () => {
  it('should return a hotel by ID (200)', async () => {
    db.query.mockResolvedValueOnce([[mockHotel]]);

    const res = await request(app).get('/api/hotels/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hotel.hotel_name).toBe('Taj Exotica');
  });

  it('should return 404 for non-existent hotel', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app).get('/api/hotels/9999');
    expect(res.statusCode).toBe(404);
  });
});

// =============================================================================
// POST /api/hotels
// =============================================================================
describe('POST /api/hotels', () => {
  const newHotel = {
    destination_id:  1,
    hotel_name:      'New Beach Resort',
    location:        'North Goa',
    price_per_night: 8500,
    rating:          4.2,
  };

  it('should create a hotel as admin (201)', async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1, name: 'Goa Beaches' }]])   // destination findById
      .mockResolvedValueOnce([{ insertId: 10 }])                    // create
      .mockResolvedValueOnce([[{ ...mockHotel, id: 10, ...newHotel }]]); // findById

    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newHotel);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hotel).toHaveProperty('id');
  });

  it('should return 403 for non-admin', async () => {
    const userToken = jwt.sign(
      { id: 2, email: 'user@example.com', role: 'user' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newHotel);

    expect(res.statusCode).toBe(403);
  });

  it('should return 400 if required fields missing', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ hotel_name: 'Incomplete Hotel' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 404 if destination does not exist', async () => {
    db.query.mockResolvedValueOnce([[]]); // destination not found

    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newHotel, destination_id: 9999 });

    expect(res.statusCode).toBe(404);
  });
});

// =============================================================================
// PUT /api/hotels/:id
// =============================================================================
describe('PUT /api/hotels/:id', () => {
  it('should update a hotel as admin (200)', async () => {
    const updated = { ...mockHotel, hotel_name: 'Updated Resort' };

    db.query
      .mockResolvedValueOnce([[mockHotel]])              // findById (exists)
      .mockResolvedValueOnce([[{ id: 1 }]])             // destination findById
      .mockResolvedValueOnce([{ affectedRows: 1 }])     // update
      .mockResolvedValueOnce([[updated]]);              // findById (return updated)

    const res = await request(app)
      .put('/api/hotels/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...mockHotel, hotel_name: 'Updated Resort' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// =============================================================================
// DELETE /api/hotels/:id
// =============================================================================
describe('DELETE /api/hotels/:id', () => {
  it('should delete a hotel as admin (200)', async () => {
    db.query
      .mockResolvedValueOnce([[mockHotel]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete('/api/hotels/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent hotel', async () => {
    db.query.mockResolvedValueOnce([[]]); // not found

    const res = await request(app)
      .delete('/api/hotels/9999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
