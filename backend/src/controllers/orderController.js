const Order = require('../models/Order');
const Cart = require('../models/Cart');

/**
 * @desc    Place an order from cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      'items.productId'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty. Add items before placing an order.',
      });
    }

    // Calculate order totals
    const subtotal = cart.getTotal();
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping above $100
    const total = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      userId: req.userId,
      items: cart.items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: shippingAddress || {},
      notes,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's order history
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId'
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
exports.updateOrder = async (req, res, next) => {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order
 * @route   DELETE /api/orders/:id
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this order',
      });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot cancel ${order.status} order`,
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
