const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create a new purchase
// @route   POST /api/purchases
// @access  Private
exports.createPurchase = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is available
    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available for purchase'
      });
    }

    // Check if user is trying to buy their own product
    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot purchase your own product'
      });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      buyer: req.user.id,
      seller: product.seller,
      product: productId,
      price: product.price
    });

    // Update product status to sold
    product.status = 'sold';
    await product.save();

    // Remove product from user's cart if it exists
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );

      if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
      }
    }

    res.status(201).json({
      success: true,
      purchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user purchases
// @route   GET /api/purchases
// @access  Private
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate({
        path: 'product',
        select: 'title price images description category status createdAt',
        populate: {
          path: 'seller',
          select: 'username email'
        }
      })
      .populate({
        path: 'seller',
        select: 'username email profileImage'
      })
      .sort({ purchaseDate: -1 })
      .lean(); // Use lean for better performance

    // Handle case where product might be deleted but purchase record exists
    const processedPurchases = purchases.map(purchase => {
      if (!purchase.product) {
        purchase.product = {
          title: 'Product No Longer Available',
          price: purchase.price,
          images: [],
          description: 'This product is no longer available',
          category: 'Other',
          status: 'unavailable'
        };
      }
      return purchase;
    });

    res.status(200).json({
      success: true,
      count: processedPurchases.length,
      purchases: processedPurchases
    });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase history',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

// @desc    Get user sales
// @route   GET /api/purchases/sales
// @access  Private
exports.getUserSales = async (req, res) => {
  try {
    const sales = await Purchase.find({ seller: req.user.id })
      .populate({
        path: 'product',
        select: 'title price images description category status createdAt'
      })
      .populate({
        path: 'buyer',
        select: 'username email profileImage'
      })
      .sort({ purchaseDate: -1 })
      .lean();

    // Handle case where product might be deleted but purchase record exists
    const processedSales = sales.map(sale => {
      if (!sale.product) {
        sale.product = {
          title: 'Product No Longer Available',
          price: sale.price,
          images: [],
          description: 'This product is no longer available',
          category: 'Other',
          status: 'unavailable'
        };
      }
      return sale;
    });

    res.status(200).json({
      success: true,
      count: processedSales.length,
      sales: processedSales
    });
  } catch (error) {
    console.error('Error fetching user sales:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales history',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};
