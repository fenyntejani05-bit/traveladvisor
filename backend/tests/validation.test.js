/**
 * Unit tests for validation middleware and request validators
 */

const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../controllers/authController');
const express = require('express');
const request = require('supertest');

describe('Validation Middleware & Auth Validator rules', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Test routes to verify validation rules and validate middleware
    app.post('/test-register', registerValidation, validate, (req, res) => {
      res.status(200).json({ success: true });
    });

    app.post('/test-login', loginValidation, validate, (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  it('should pass validation when valid register data is provided', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'ValidPassword123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail validation when name is too short', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'J',
        email: 'johndoe@example.com',
        password: 'ValidPassword123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe('name');
  });

  it('should fail validation when email is invalid', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'ValidPassword123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('should fail validation when password lacks uppercase', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'invalidpassword1'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].message).toContain('uppercase');
  });

  it('should fail validation when password is too short', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'Short1'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
