/**
 * Unit tests for global errorHandler middleware
 */

const errorHandler = require('../middleware/errorHandler');

describe('Global Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  it('should handle JsonWebTokenError with status 401', () => {
    const err = { name: 'JsonWebTokenError' };
    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token. Please log in again.'
    });
  });

  it('should handle TokenExpiredError with status 401', () => {
    const err = { name: 'TokenExpiredError' };
    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token has expired. Please log in again.'
    });
  });

  it('should handle ER_DUP_ENTRY with status 409', () => {
    const err = { code: 'ER_DUP_ENTRY' };
    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'A record with this value already exists.'
    });
  });

  it('should handle custom error status codes', () => {
    const err = { statusCode: 403, message: 'Forbidden access' };
    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden access'
    });
  });

  it('should fallback to 500 status code for unknown server errors', () => {
    const err = new Error('Database crash');
    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });
});
