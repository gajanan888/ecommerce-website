const Product = require('../models/Product');
const { uploadToCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all products with optional filtering
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    console.log('📦 GetAllProducts - Request Received', req.query);

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
      stock,
      sizes,
      material,
    } = req.body;

    let image = req.body.image;
    let images = req.body.images;

    // Handle Image Upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'products');
      if (result) {
        image = result.url;
        images = [result.url]; // Default single image to array
      }
    }

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields (including image)',
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
      sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Handle form-data array parsing
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
    // Handle Image Upload if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'products');
      if (result) {
        req.body.image = result.url;
        // Optionally append to images or replace? For simple update, let's keep it simple.
        // req.body.images = [result.url]; 
      }
    }

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
    // Try to find marked featured products first
    let products = await Product.find({ featured: true }).limit(6);

    // If not enough featured products, fill with newest items
    if (products.length < 4) {
      const existingIds = products.map((p) => p._id);
      const newProducts = await Product.find({ _id: { $nin: existingIds } })
        .sort({ createdAt: -1 })
        .limit(8 - products.length); // Fetch enough to make a decent grid
      products = [...products, ...newProducts];
    }

    // Limit to 8 max just in case
    products = products.slice(0, 8);

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
