const Product = require('../models/Product');

/**
 * @desc    Get all products with optional filtering
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;

    // Build filter object
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Query database
    let query = Product.find(filter);

    // Apply sorting
    if (sort) {
      if (sort === 'price-asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'newest') {
        query = query.sort({ createdAt: -1 });
      } else if (sort === 'rating') {
        query = query.sort({ rating: -1 });
      }
    }

    const products = await query.exec();

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      images,
      stock,
      sizes,
      material,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      images: images || [image],
      stock: stock || 10,
      sizes: sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      material: material || 'Premium Cotton Blend',
    });

    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
