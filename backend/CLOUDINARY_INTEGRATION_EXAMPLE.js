/**
 * Example: How to use Cloudinary and Multer in your routes
 *
 * In your route file (e.g., routes/products.js):
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require('../utils/cloudinary');
const auth = require('../middleware/auth');

// Example: Create product with image
router.post(
  '/create',
  auth,
  upload.single('image'), // Expects form-data with "image" field
  async (req, res) => {
    try {
      const { name, price, description } = req.body;

      // Validate required fields
      if (!name || !price) {
        if (req.file) {
          // Delete file if validation fails
          const fs = require('fs');
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: 'Name and price are required' });
      }

      // Upload image to Cloudinary
      let imageData = null;
      if (req.file) {
        imageData = await uploadToCloudinary(req.file.path, 'products');
        if (!imageData) {
          return res.status(400).json({ message: 'Image upload failed' });
        }
      }

      // Create product in database with image URL
      const product = {
        name,
        price,
        description,
        image: imageData?.url || null,
        imagePublicId: imageData?.publicId || null,
      };

      // Save to database...
      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Example: Update product with new image
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const oldImagePublicId = req.body.oldImagePublicId;

    // Upload new image if provided
    let imageData = null;
    if (req.file) {
      // Delete old image from Cloudinary
      if (oldImagePublicId) {
        await deleteFromCloudinary(oldImagePublicId);
      }

      imageData = await uploadToCloudinary(req.file.path, 'products');
    }

    // Update product in database...
    res.status(200).json({
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example: Delete product and image
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const imagePublicId = req.body.imagePublicId;

    // Delete image from Cloudinary
    if (imagePublicId) {
      await deleteFromCloudinary(imagePublicId);
    }

    // Delete product from database...
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example: Upload multiple images (gallery)
router.post(
  '/gallery/upload',
  auth,
  upload.array('images', 5), // Max 5 images
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images provided' });
      }

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path, 'products/gallery')
      );

      const results = await Promise.all(uploadPromises);

      if (results.some((r) => r === null)) {
        return res
          .status(400)
          .json({ message: 'Some images failed to upload' });
      }

      res.status(201).json({
        message: 'Images uploaded successfully',
        images: results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
