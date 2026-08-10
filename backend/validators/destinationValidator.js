const { body } = require('express-validator');

const destinationValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Destination name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Destination name must be between 2 and 150 characters'),
  body('category_id')
    .notEmpty()
    .withMessage('Category ID is required')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0.0 and 5.0'),
  body('image_url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('is_featured')
    .optional()
    .isBoolean()
    .withMessage('is_featured must be a boolean value'),
];

module.exports = {
  destinationValidator,
};
