const { check } = require('express-validator');

exports.createProductValidator = [
  check('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  check('description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  check('price')
    .not()
    .isEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => {
      if (value <= 0) {
        throw new Error('Price must be greater than 0');
      }
      return true;
    }),
  
  check('category')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Category is required'),

  check('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom(images => {
      if (images && images.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      return true;
    })
];

exports.updateProductValidator = [
  check('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  check('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  check('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => {
      if (value <= 0) {
        throw new Error('Price must be greater than 0');
      }
      return true;
    }),
  
  check('category')
    .optional()
    .trim(),
  
  check('condition')
    .optional()
    .trim()
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition value'),
  
  check('status')
    .optional()
    .trim()
    .isIn(['available', 'sold', 'reserved'])
    .withMessage('Invalid status value'),
  
  check('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom(images => {
      if (images && images.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      return true;
    })
];