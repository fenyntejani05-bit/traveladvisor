/**
 * Integration Tests for Complete Workflows
 * Uses mocked database connection to simulate end-to-end user and admin workflows
 */

jest.mock('../config/db', () => ({
  query:          jest.fn(),
  pool:           { getConnection: jest.fn(), end: jest.fn() },
  testConnection: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../config/db');

const validUser = {
  name: 'Integration User',
  email: 'integration@example.com',
  password: 'Password123'
};

const adminToken = jwt.sign(
  { id: 1, email: 'admin@traveladvisor.com', role: 'admin' },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: '1h' }
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Integration Workflows', () => {
  
  describe('User Registration & Login Integration Workflow', () => {
    it('should complete registration -> login -> fetch profile workflow', async () => {
      const hashedPassword = await bcrypt.hash(validUser.password, 10);

      // Registration Mocks
      db.query
        .mockResolvedValueOnce([[]]) // findByEmail checks
        .mockResolvedValueOnce([{ insertId: 42 }]) // insert user
        .mockResolvedValueOnce([[{ id: 42, name: validUser.name, email: validUser.email, role: 'user' }]]); // findById returns user

      const regRes = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(regRes.statusCode).toBe(201);
      expect(regRes.body.success).toBe(true);
      expect(regRes.body.data.user.email).toBe(validUser.email);
      expect(regRes.body.data).toHaveProperty('token');

      // Login Mocks
      db.query.mockResolvedValueOnce([[{
        id: 42,
        name: validUser.name,
        email: validUser.email,
        password: hashedPassword,
        role: 'user'
      }]]);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body.success).toBe(true);
      const generatedToken = loginRes.body.data.token;
      expect(generatedToken).toBeDefined();

      // Profile Fetch Mock
      db.query.mockResolvedValueOnce([[{
        id: 42,
        name: validUser.name,
        email: validUser.email,
        role: 'user'
      }]]);

      const profileRes = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${generatedToken}`);

      expect(profileRes.statusCode).toBe(200);
      expect(profileRes.body.data.user.id).toBe(42);
    });
  });

  describe('Destination, Hotel, and Review CRUD Integration Workflow', () => {
    it('should successfully CRUD a destination, link a hotel, and submit reviews', async () => {
      // 1. Create Destination
      const newDest = {
        category_id: 1,
        name: 'Integration Beach Resort',
        state: 'Goa',
        city: 'Calangute',
        description: 'Testing destination CRUD and integrations.',
        budget: 5000,
        rating: 4.5
      };

      db.query
        .mockResolvedValueOnce([[{ id: 1, category_name: 'Beach' }]]) // category verification
        .mockResolvedValueOnce([{ insertId: 101 }]) // insert destination
        .mockResolvedValueOnce([[{ id: 101, ...newDest }]]); // return destination by ID

      const destRes = await request(app)
        .post('/api/destinations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newDest);

      expect(destRes.statusCode).toBe(201);
      expect(destRes.body.data.destination.id).toBe(101);

      // 2. Add Hotel to Destination
      const newHotel = {
        destination_id: 101,
        hotel_name: 'Calangute Sands Hotel',
        location: 'Calangute Main Road',
        price_per_night: 2500,
        rating: 4
      };

      db.query
        .mockResolvedValueOnce([[{ id: 101 }]]) // check destination exists
        .mockResolvedValueOnce([{ insertId: 201 }]) // insert hotel
        .mockResolvedValueOnce([[{ id: 201, ...newHotel }]]); // return hotel by ID

      const hotelRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newHotel);

      expect(hotelRes.statusCode).toBe(201);
      expect(hotelRes.body.data.hotel.id).toBe(201);

      // 3. Submit Review
      const newReview = {
        destination_id: 101,
        rating: 5,
        review: 'Excellent integration destination testing'
      };

      db.query
        .mockResolvedValueOnce([[{ id: 101 }]]) // check destination exists
        .mockResolvedValueOnce([{ insertId: 301 }]) // insert review
        .mockResolvedValueOnce([[{ total: 5.0 }]]) // avg rating
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // updateRating
        .mockResolvedValueOnce([[{ id: 301, user_id: 1, ...newReview }]]); // return review by ID

      const reviewRes = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newReview);

      expect(reviewRes.statusCode).toBe(201);
      expect(reviewRes.body.data.review.id).toBe(301);
    });
  });
});
