const express = require('express');
const { createPurchase, getUserPurchases, getUserSales } = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Purchase routes
router.route('/')
  .post(createPurchase)
  .get(getUserPurchases);

router.route('/sales').get(getUserSales);

module.exports = router;