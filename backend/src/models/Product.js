const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'T-Shirts',
        'Shirts',
        'Jeans',
        'Jackets',
        'Hoodies',
        'Basics',
        'Outerwear',
        'Denim',
        'Women',
        'Men',
        'Accessories',
        'Kids',
        'Electronics',
        'Sports',
        'Home',
        'Beauty',
        'Books',
        'Clothing',
        'Dresses',
        'Tops',
        'Overalls',
      ],
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Children', 'Unisex'],
      required: false,
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL'],
    },
    images: [String],
    stock: {
      type: Number,
      default: 10,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    sizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    material: {
      type: String,
      default: 'Premium Cotton Blend',
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
