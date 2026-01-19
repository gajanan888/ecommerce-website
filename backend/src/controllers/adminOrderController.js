const Order = require('../models/Order');
const User = require('../models/User');

/**
 * Admin Order Controller
 * Handles all order management operations by admins
 */

/**
 * Get All Orders (Admin View)
 * GET /api/admin/orders
 * Admin only - includes pagination and filters
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      // Search by order ID or customer email
      filter.$or = [{ _id: { $regex: search, $options: 'i' } }];
    }

    // Fetch orders with populated user data
    const orders = await Order.find(filter)
      .populate('userId', 'name email phone address')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      count: orders.length,
      total,
      page: parseInt(page),
      pages: totalPages,
      data: {
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Get Order by ID (Admin View)
 * GET /api/admin/orders/:id
 * Admin only
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      'userId',
      'name email phone address'
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update Order Status
 * PUT /api/admin/orders/:id/status
 * Admin only
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Check if order exists
    let order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Update order status
    order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone address');

    res.status(200).json({
      status: 'success',
      message: `Order status updated to ${status}`,
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update Payment Status
 * PUT /api/admin/orders/:id/payment-status
 * Admin only
 */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Validate payment status
    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        status: 'error',
        message: `Payment status must be one of: ${validPaymentStatuses.join(
          ', '
        )}`,
      });
    }

    // Check if order exists
    let order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Update payment status
    order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone address');

    res.status(200).json({
      status: 'success',
      message: `Payment status updated to ${paymentStatus}`,
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update Tracking Number
 * PUT /api/admin/orders/:id/tracking
 * Admin only
 */
exports.updateTrackingNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Tracking number is required',
      });
    }

    // Check if order exists
    let order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Update tracking number
    order = await Order.findByIdAndUpdate(
      id,
      { trackingNumber },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone address');

    res.status(200).json({
      status: 'success',
      message: 'Tracking number updated',
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Get Order Statistics
 * GET /api/admin/orders/stats/summary
 * Admin only
 */
exports.getOrderStats = async (req, res) => {
  try {
    // Get total stats
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    // Count by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Count by payment status
    const ordersByPaymentStatus = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        ordersByPaymentStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
