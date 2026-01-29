const Product = require('../models/Product');

/**
 * Admin Product Controller
 * Handles all product management operations by admins
 */

/**
 * Create Product
 * POST /api/admin/products
 * Admin only
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      material,
      featured,
      gender,
      tags,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, price, and category',
      });
    }

    // Handle image - either from file upload or URL
    let imageUrl = image || '/images/placeholder.jpg';

    if (req.file) {
      // If file was uploaded, use the file path
      // Move file from temp to public/images/products
      const fs = require('fs');
      const path = require('path');
      const publicDir = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'images',
        'products'
      );

      // Create directory if it doesn't exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const newFileName = Date.now() + '-' + req.file.originalname;
      const newPath = path.join(publicDir, newFileName);

      // Move file
      fs.renameSync(req.file.path, newPath);

      imageUrl = `/images/products/${newFileName}`;
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        status: 'error',
        message: 'Product with this name already exists',
      });
    }

    // Parse arrays if they're strings - safely handle undefined/empty values
    let parsedSizes;
    let parsedTags;

    try {
      parsedSizes =
        sizes && typeof sizes === 'string'
          ? JSON.parse(sizes)
          : Array.isArray(sizes)
            ? sizes
            : undefined;
    } catch (e) {
      parsedSizes = undefined;
    }

    try {
      parsedTags =
        tags && typeof tags === 'string'
          ? JSON.parse(tags)
          : Array.isArray(tags)
            ? tags
            : undefined;
    } catch (e) {
      parsedTags = undefined;
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      stock: stock || 10,
      sizes: parsedSizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      material: material || 'Cotton',
      featured: featured || false,
      gender: gender || undefined,
      tags: parsedTags || [],
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product,
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
 * Get All Products (Admin View)
 * GET /api/admin/products
 * Admin only - includes pagination and filters
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, featured } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      count: products.length,
      total,
      page: parseInt(page),
      pages: totalPages,
      data: {
        products,
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
 * Get Product by ID (Admin View)
 * GET /api/admin/products/:id
 * Admin only
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
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
 * Update Product
 * PUT /api/admin/products/:id
 * Admin only
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      material,
      featured,
    } = req.body;

    // Check if product exists
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(400).json({
          status: 'error',
          message: 'Product with this name already exists',
        });
      }
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
        ...(image && { image }),
        ...(stock !== undefined && { stock }),
        ...(sizes && { sizes }),
        ...(material && { material }),
        ...(featured !== undefined && { featured }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product,
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
 * Delete Product
 * DELETE /api/admin/products/:id
 * Admin only
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: {
        productId: id,
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
 * Bulk Update Products (useful for inventory management)
 * PUT /api/admin/products/bulk/update
 * Admin only
 */
exports.bulkUpdateProducts = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stock, price, etc }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Provide an array of product updates',
      });
    }

    const results = [];

    for (const update of updates) {
      const { id, ...data } = update;
      const product = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (product) {
        results.push(product);
      }
    }

    res.status(200).json({
      status: 'success',
      message: `${results.length} products updated`,
      data: {
        products: results,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
