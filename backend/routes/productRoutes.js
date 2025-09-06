const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getUserProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { createProductValidator, updateProductValidator } = require('../validators/productValidators');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, createProductValidator, validate, createProduct);
router.put('/:id', protect, updateProductValidator, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/user/listings', protect, getUserProducts);

module.exports = router;