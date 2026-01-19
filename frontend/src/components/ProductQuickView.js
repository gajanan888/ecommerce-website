import React, { useContext, useState } from 'react';
import { FiX, FiStar, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showSuccess, showError } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [heartBeat, setHeartBeat] = useState(false);

  if (!isOpen || !product) return null;

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const images = product.images || [
    'https://via.placeholder.com/500?text=Product+Image',
  ];
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      setAdded(true);
      showSuccess(`${product.name} added to cart!`);
      setTimeout(() => {
        setAdded(false);
        setQuantity(1);
        onClose();
      }, 1500);
    } catch (error) {
      showError(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      setWishlistLoading(true);
      setHeartBeat(true);
      await toggleWishlist(product._id);
      setTimeout(() => setHeartBeat(false), 600);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm z-10">
          <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 active:scale-95"
          >
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
                <img
                  src={images[currentImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-full font-bold text-sm">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1.5 rounded-full font-bold text-sm">
                    New
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'border-orange-600 scale-102'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div className="flex flex-col gap-4">
              {/* Brand & Category */}
              <div>
                <p className="text-sm font-semibold text-orange-600 mb-1">
                  {product.category || 'Product'}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={16}
                      className={`transition-all ${
                        i < Math.floor(product.avgRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.avgRating || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="py-4 border-t border-b border-gray-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-sm text-orange-600 font-semibold mt-2">
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description.substring(0, 150)}...
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 0 ? 'bg-orange-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-semibold text-gray-700">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, val));
                    }}
                    className="w-12 text-center border-0 focus:outline-none font-semibold"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || 99, quantity + 1))
                    }
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.stock || added}
                  className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                    addingToCart || !product.stock || added
                      ? 'cursor-not-allowed opacity-75'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    backgroundColor: added
                      ? '#FF8A00'
                      : !product.stock
                      ? '#CBD5E1'
                      : '#FF8A00',
                    boxShadow: added
                      ? '0 4px 12px rgba(255, 138, 0, 0.3)'
                      : '0 4px 12px rgba(255, 138, 0, 0.2)',
                  }}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Adding...</span>
                    </>
                  ) : added ? (
                    <>
                      <FiCheck size={20} />
                      <span>Added to Cart!</span>
                    </>
                  ) : !product.stock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <FiShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    heartBeat ? 'animate-heartbeat' : ''
                  } ${
                    inWishlist
                      ? 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                      : 'bg-gray-50 border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                  }`}
                  title={
                    inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                  }
                >
                  <FiHeart
                    size={20}
                    className={`transition-all duration-300 ${
                      inWishlist
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Shipping Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                ✓ Free shipping on orders over $50
              </div>

              {/* View Full Details Link */}
              <button className="text-orange-600 hover:text-orange-700 font-semibold underline text-sm transition-colors">
                View full product details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-heartbeat {
          animation: heartbeat 0.6s ease-out;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductQuickView;
