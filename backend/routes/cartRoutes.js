const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart, updateQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;