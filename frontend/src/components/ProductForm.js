import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

export default function ProductForm({
  product = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    stock: 10,
    gender: '',
    material: '',
    sizes: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        image: product.image || '',
        description: product.description || '',
        stock: product.stock || 10,
        gender: product.gender || '',
        material: product.material || '',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Transform data before submitting
      const submitData = {
        ...formData,
        // Convert comma-separated strings to arrays
        sizes: formData.sizes
          ? formData.sizes
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s)
          : undefined,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t)
          : undefined,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Hoodies">Hoodies</option>
          <option value="Basics">Basics</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Denim">Denim</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Accessories">Accessories</option>
          <option value="Kids">Kids</option>
          <option value="Dresses">Dresses</option>
          <option value="Tops">Tops</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image *
        </label>

        {/* File Input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData((prev) => ({ ...prev, imageFile: file }));
              // Create local preview
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result }));
              };
              reader.readAsDataURL(file);

              // Clear error
              if (errors.image) {
                setErrors((prev) => ({ ...prev, image: '' }));
              }
            }
          }}
          className={`block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            ${errors.image ? 'border-red-500' : ''}
          `}
          disabled={isLoading}
        />

        {/* URL Input Fallback (Optional, but useful if they want to paste a link) */}
        <div className="mt-2 text-xs text-gray-500 text-center">- OR -</div>
        <input
          type="text"
          name="imageUrl"
          value={
            !formData.imageFile &&
            formData.image &&
            !formData.image.startsWith('data:')
              ? formData.image
              : ''
          }
          onChange={(e) => {
            const url = e.target.value;
            setFormData((prev) => ({ ...prev, image: url, imageFile: null }));
            // Clear error
            if (errors.image) {
              setErrors((prev) => ({ ...prev, image: '' }));
            }
          }}
          placeholder="Paste Image URL (e.g., /images/products/shirt.jpg)"
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        />

        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}

        {/* Preview */}
        {formData.image && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img
              src={getImageUrl(formData.image)}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/100?text=Image+Error';
              }}
            />
          </div>
        )}
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Quantity
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="10"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender (Optional)
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Select gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Children">Children</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Material (Optional)
        </label>
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder="e.g., 100% Cotton, Premium Cotton Blend"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sizes (Optional)
        </label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          placeholder="e.g., S, M, L, XL or 28, 30, 32, 34"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">Separate sizes with commas</p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (Optional)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., casual, summer, trendy"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows="4"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
