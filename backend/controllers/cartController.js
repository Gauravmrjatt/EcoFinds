const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate cart totals in rupees
const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => {
    if (item.product && item.product.price) {
      return sum + (item.product.price * item.quantity);
    }
    return sum;
  }, 0);
  
  const shipping = cartItems.length > 0 ? 49 : 0; // ₹49 shipping
  const tax = subtotal * 0.18; // 18% GST in India
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    currency: 'INR',
    currencySymbol: '₹'
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'title price images status seller'
    });

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Filter out any products that are no longer available
    cart.items = cart.items.filter(item => 
      item.product && item.product.status === 'available'
    );

    await cart.save();

    // Calculate cart totals
    const cartTotals = calculateCartTotals(cart.items);

    res.status(200).json({
      success: true,
      cart,
      totals: cartTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate quantity
    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer'
      });
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check if user is trying to add their own product
    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add your own product to cart'
      });
    }

    // Find user's cart or create one
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Check if product is already in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({
        product: productId,
        quantity: quantity,
        addedAt: Date.now()
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Return updated cart with populated product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title price images status seller'
    });

    // Calculate cart totals
    const cartTotals = calculateCartTotals(updatedCart.items);

    res.status(200).json({
      success: true,
      cart: updatedCart,
      totals: cartTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if product is in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Remove product from cart
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();
    
    await cart.save();

    // Return updated cart with populated product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title price images status seller'
    });

    // Calculate cart totals
    const cartTotals = calculateCartTotals(updatedCart.items);

    res.status(200).json({
      success: true,
      cart: updatedCart,
      totals: cartTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart
// @access  Private
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate quantity
    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer'
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if product is in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    
    await cart.save();

    // Return updated cart with populated product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title price images status seller'
    });

    // Calculate cart totals
    const cartTotals = calculateCartTotals(updatedCart.items);

    res.status(200).json({
      success: true,
      cart: updatedCart,
      totals: cartTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart items
    cart.items = [];
    cart.updatedAt = Date.now();
    
    await cart.save();

    // Calculate cart totals (should be zero)
    const cartTotals = calculateCartTotals(cart.items);

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
      totals: cartTotals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};