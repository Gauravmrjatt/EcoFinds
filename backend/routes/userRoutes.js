const express = require('express');
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { updateProfileValidator, changePasswordValidator } = require('../validators/userValidators');
const { validate } = require('../middleware/validator');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateProfileValidator, validate, updateUserProfile);
router.put('/change-password', changePasswordValidator, validate, changePassword);

module.exports = router;