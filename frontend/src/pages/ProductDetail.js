import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useTitle } from '../hooks/useTitle';
import { products } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Convert id to correct type and validate
  const productId = id ? parseInt(id, 10) : null;
  const product =
    productId && !isNaN(productId)
      ? products.find((p) => p && p.id === productId)
      : null;

  // Validate product data
  const isValidProduct =
    product &&
    product.image &&
    product.name &&
    product.category &&
    typeof product.price === 'number' &&
    product.description;

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [productId]);

  // Set page title based on product
  useTitle(
    isValidProduct
      ? `${product.name} | StyleHub - Premium Fashion Store`
      : 'Product Not Found | StyleHub'
  );

  // Handle Add to Cart - validate size selection and authentication
  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store current location for redirect after login
      navigate('/login', {
        state: { from: location.pathname },
      });
      return;
    }

    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }

    // Add to cart with quantity and size
    addToCart(product, quantity, selectedSize);

    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse mt-8"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found
  if (!isValidProduct) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-16 md:pt-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {!productId || isNaN(productId)
              ? 'Invalid product ID. Please check the URL.'
              : "Sorry, we couldn't find the product you're looking for."}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
          >
            <FiArrowLeft size={20} />
            Back to Collections
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 border-b border-gray-200">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          <FiArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Collections</span>
        </button>
      </div>

      {/* Product Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover aspect-[3/4]"
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-4">
            {/* Category */}
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-200 mb-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                  Material
                </p>
                <p className="text-gray-900 font-medium">
                  Premium Cotton Blend
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                  Shipping
                </p>
                <p className="text-gray-900 font-medium">
                  Free on Orders $100+
                </p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Size
                </label>
                {sizeError && (
                  <span className="text-xs text-red-500 font-medium animate-pulse">
                    Please select a size
                  </span>
                )}
              </div>

              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`py-3 px-2 text-sm font-semibold transition-all duration-200 border-2 ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-10">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider block mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={18} />
                </button>
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              {/* Add to Cart - Primary */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 font-bold transition-all duration-300 active:scale-95 ${
                  addedToCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                aria-label={`Add ${product?.name} to cart`}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Wishlist - Secondary */}
              <button
                disabled
                title="Wishlist feature coming soon"
                className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-50 hover:border-gray-300 transition-colors duration-300"
                aria-label="Add to wishlist (feature coming soon)"
              >
                <FiHeart size={24} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">✓</span>
                <span>100% Authentic Product</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">✓</span>
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">✓</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
