const { check } = require('express-validator');

exports.updateProfileValidator = [
  check('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  check('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  check('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  check('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
];

exports.changePasswordValidator = [
  check('currentPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Current password is required'),
  
  check('newPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number'),
  
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];