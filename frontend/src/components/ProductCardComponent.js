import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1520974735194-6b1f1f5f4f63?w=800&h=1000&fit=crop&auto=format&q=80';

  // Check if user is logged in (from localStorage)
  const isLoggedIn = () => {
    return !!localStorage.getItem('authToken');
  };

  const handleWishlistClick = (e) => {
    // Prevent triggering Link navigation when clicking wishlist button
    e.preventDefault();
    e.stopPropagation();

    // If user is not logged in, redirect to login
    if (!isLoggedIn()) {
      navigate('/login', {
        state: { returnTo: location.pathname + location.search },
      });
      return;
    }

    setWishlistLoading(true);
    setTimeout(() => {
      setIsWishlisted(!isWishlisted);
      setWishlistLoading(false);
    }, 300);
  };

  // Handle image path - check if it's a local path or URL
  const getImagePath = (imagePath) => {
    if (!imagePath || imageError) return FALLBACK_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    // For local paths, prepend public URL
    return `${window.location.origin}${imagePath}`;
  };

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Link to={`/product/${product._id || product.id}`} className="no-underline">
      <motion.div
        className="flex flex-col h-full overflow-hidden transition-shadow duration-300 bg-white shadow-md cursor-pointer group rounded-2xl hover:shadow-2xl"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
          <motion.img
            src={getImagePath(product.image)}
            alt={product.name}
            className="object-cover w-full h-full"
            width="800"
            height="1000"
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              if (e?.target?.src !== FALLBACK_IMAGE) {
                setImageError(true);
                e.target.src = FALLBACK_IMAGE;
              }
            }}
          />

          {/* Badges Container - Top Left */}
          <div className="absolute z-20 flex flex-col gap-2 top-4 left-4">
            {/* Discount Badge */}
            {product.discount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-md"
              >
                -{product.discount}%
              </motion.div>
            )}

            {/* New Badge - Subtle and elegant */}
            {product.isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="px-3 py-1 text-xs font-bold tracking-wide text-white uppercase rounded-full shadow-md bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                NEW
              </motion.div>
            )}
          </div>

          {/* Wishlist Button - Top Right */}
          <motion.button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className="absolute z-20 p-2 transition-all duration-300 rounded-full shadow-md top-4 right-4 bg-white/80 backdrop-blur-md hover:bg-white/95 hover:shadow-lg disabled:opacity-70"
            aria-label={`Add ${product.name} to wishlist`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: isWishlisted ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <FiHeart
                size={20}
                className={`transition-all duration-300 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
                } ${wishlistLoading ? 'animate-pulse' : ''}`}
              />
            </motion.div>
          </motion.button>

          {/* Action Buttons Overlay - On Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-end justify-center gap-3 pb-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          >
            {/* Quick View Button */}
            {onQuickView && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 font-medium text-gray-900 transition-colors duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-100"
              >
                <FiEye size={16} />
                <span className="hidden sm:inline">Quick View</span>
              </motion.button>
            )}

            {/* Add to Cart Button */}
            {onAddToCart && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={product.stock === 0}
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors duration-300 bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={16} />
                <span className="hidden sm:inline">Add to Cart</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow p-4">
          <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
            {product.category}
          </p>
          <motion.h3
            className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-500 line-clamp-2 leading-snug min-h-[3rem]"
            whileHover={{ color: '#ea580c' }}
          >
            {product.name}
          </motion.h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto">
            {product.discount > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{discountedPrice.toFixed(0)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toFixed(0)}
                </span>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                ₹{product.price.toFixed(0)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <p
              className={`mt-2 text-xs font-medium ${
                product.stock > 10
                  ? 'text-green-600'
                  : product.stock > 0
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            >
              {product.stock > 10
                ? `${product.stock} in stock`
                : product.stock > 0
                ? `Only ${product.stock} left`
                : 'Out of stock'}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
