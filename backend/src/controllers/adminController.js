const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Discount = require('../models/Discount');

// ========== DASHBOARD STATS ==========
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        shippedOrders,
        completedOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== ORDERS MANAGEMENT ==========
exports.getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone addresses')
      .populate('products.productId', 'name price category');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(
        status
      )
    ) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('order:status-updated', {
        orderId: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
      });
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (
      !['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)
    ) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('order:payment-updated', {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
      });
    }

    res.json({ success: true, message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingNumber, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('order:tracking-updated', {
        orderId: order._id,
        trackingNumber: order.trackingNumber,
      });
    }

    res.json({ success: true, message: 'Tracking number updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PAYMENTS TRACKING ==========
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { paymentStatus: 'completed' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
    ]);

    const totalCompleted = await Order.countDocuments(filter);
    const totalFailed = await Order.countDocuments({ paymentStatus: 'failed' });
    const totalRefunded = await Order.countDocuments({
      paymentStatus: 'refunded',
    });

    res.json({
      success: true,
      paymentStats: {
        totalCompleted,
        totalFailed,
        totalRefunded,
        byMethod: payments,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== USERS MANAGEMENT ==========
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive = true, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (isActive !== 'all') filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userOrders = await Order.find({ userId: req.params.id });
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        totalOrders: userOrders.length,
        totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user: await user
        .save()
        .then((u) => ({ ...u.toObject(), password: undefined })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== DISCOUNTS & OFFERS MANAGEMENT ==========
exports.getAllDiscounts = async (req, res) => {
  try {
    const { isActive = 'all', page = 1, limit = 10 } = req.query;

    let filter = {};
    if (isActive !== 'all') filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const discounts = await Discount.find(filter)
      .populate('createdBy', 'name email')
      .populate('applicableProducts', 'name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Discount.countDocuments(filter);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      discounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const discountData = {
      ...req.body,
      createdBy: req.userId,
    };

    const discount = await Discount.create(discountData);
    await discount.populate('applicableProducts', 'name');

    res.status(201).json({ success: true, discount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('applicableProducts', 'name');

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json({ success: true, discount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json({ success: true, message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleDiscountActive = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    discount.isActive = !discount.isActive;
    await discount.save();

    res.json({
      success: true,
      message: `Discount ${discount.isActive ? 'activated' : 'deactivated'}`,
      discount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
