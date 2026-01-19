const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Ensure all user routes are protected
router.use(protect);

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 }),
    body('phone').optional().isMobilePhone(),
    body('addresses').optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      if (req.userId !== req.params.id && req.userRole !== 'admin') {
        return res
          .status(403)
          .json({ success: false, message: 'Access denied' });
      }

      const { name, phone, profileImage, addresses } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone, profileImage, addresses, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
