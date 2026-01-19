const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate({
      path: 'items.productId',
      select: 'name price image category',
    });

    if (!cart) {
      return res.status(200).json({
        status: 'success',
        message: 'Cart is empty',
        data: {
          items: [],
          itemCount: 0,
          total: 0,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        items: cart.items,
        itemCount: cart.getItemCount(),
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size = 'M' } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required',
      });
    }

    if (quantity < 1 || quantity > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be between 1 and 100',
      });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${product.stock} items available`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [],
      });
    }

    // Check if product with same size already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;

      if (cart.items[existingItemIndex].quantity > 100) {
        cart.items[existingItemIndex].quantity = 100;
      }
    } else {
      // Add new item
      cart.items.push({
        productId,
        productName: product.name,
        productImage: product.image,
        category: product.category,
        price: product.price,
        quantity,
        size,
      });
    }

    await cart.save();

    res.status(201).json({
      status: 'success',
      message: 'Product added to cart',
      data: {
        items: cart.items,
        itemCount: cart.getItemCount(),
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update/:itemId
 * @access  Private
 */
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be between 1 and 100',
      });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    // Find the item
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart',
      });
    }

    // Check stock availability
    const product = await Product.findById(item.productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${product.stock} items available`,
      });
    }

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item quantity updated',
      data: {
        items: cart.items,
        itemCount: cart.getItemCount(),
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:itemId
 * @access  Private
 */
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    // Remove item
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: {
        items: cart.items,
        itemCount: cart.getItemCount(),
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared',
      data: {
        items: [],
        itemCount: 0,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
