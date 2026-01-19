import React, { useState, useContext } from 'react';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1520974735194-6b1f1f5f4f63?w=800&h=1000&fit=crop&auto=format&q=80';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [heartBeat, setHeartBeat] = useState(false);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showSuccess, showError } = useToast();
  const discount = Number(product.discount) || 0;
  const discountedPrice = Number(product.price) * (1 - discount / 100);
  const inWishlist = isInWishlist(product._id);

  const imgSrc =
    (product.images && product.images[0]) || product.image || FALLBACK_IMAGE;

  const handleImgError = (e) => {
    if (e?.target?.src !== FALLBACK_IMAGE) {
      e.target.src = FALLBACK_IMAGE;
    }
  };

  const handleAddToCart = async (id) => {
    try {
      setAddingToCart(true);
      await onAddToCart(id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
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
      className="relative flex flex-col h-full p-3 transition-all duration-300 ease-out bg-white rounded-lg animate-fadeInUp hover:shadow-lg group"
      style={{
        border: '1px solid #E5E7EB',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className={`absolute top-4 right-4 z-10 p-2.5 bg-white rounded-full transition-all duration-300 border border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:scale-110 group active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-1 ${
          heartBeat ? 'animate-heartbeat' : ''
        }`}
        style={{
          boxShadow: inWishlist
            ? '0 4px 12px rgba(239, 68, 68, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FiHeart
          size={20}
          className={`transition-all duration-300 ${
            inWishlist
              ? 'fill-orange-500 text-orange-500 scale-110'
              : 'text-gray-400 group-hover:text-orange-500'
          }`}
        />
      </button>

      {/* Product Image Container */}
      <div
        className="relative w-full mb-3 overflow-hidden border border-gray-100 rounded-lg group/img aspect-[4/5]"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover/img:scale-110"
          onError={handleImgError}
          loading="lazy"
          decoding="async"
          width="800"
          height="1000"
        />
        {product.isNew === true && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 px-2 py-0.5 rounded-md text-[10px] font-semibold shadow-sm">
            New
          </div>
        )}
      </div>

      {/* Product Category */}
      <p
        className="flex-shrink-0 mb-1 text-xs font-medium tracking-wide uppercase line-clamp-1"
        style={{ color: '#FF8A00' }}
      >
        {product.category}
      </p>

      {/* Product Name */}
      <h3
        className="mb-0 text-lg font-bold leading-tight transition-colors duration-300 cursor-default line-clamp-2 hover:text-orange-700"
        style={{ color: '#FF8A00' }}
      >
        {product.name}
      </h3>

      {/* Rating Section */}
      <div className="flex items-center gap-1 mb-2 -mt-1">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={14}
              className={
                i < Math.round(product.rating || 4.5) ? 'fill-yellow-400' : ''
              }
              style={{ color: '#FACC15' }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: '#475569' }}>
          {product.rating?.toFixed(1) || '4.5'}
        </span>
        <span className="text-xs" style={{ color: '#94A3B8' }}>
          ({product.reviews?.length || 0})
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-center flex-shrink-0 gap-2 mb-1">
        <span className="text-2xl font-bold" style={{ color: '#FF8A00' }}>
          ₹{discountedPrice.toFixed(0)}
        </span>
        {discount > 0 && (
          <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Stock Status */}
      <p
        className="flex-shrink-0 mb-3 text-sm font-semibold"
        style={{ color: '#16A34A' }}
      >
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => handleAddToCart(product._id)}
          disabled={addingToCart}
          className={`w-full text-white py-2 rounded-lg transition-all duration-300 ease-out flex items-center justify-center gap-2 font-semibold transform ${
            addingToCart
              ? 'cursor-not-allowed'
              : 'hover:-translate-y-1 active:scale-95'
          }`}
          style={{
            backgroundColor: addingToCart
              ? '#D1D5DB'
              : added
              ? '#22C55E'
              : '#FF8A00',
          }}
        >
          {addingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin-smooth border-t-transparent"></div>
              <span>Adding...</span>
            </>
          ) : added ? (
            <>
              <FiShoppingCart size={20} />
              <span>✓ Added to Cart</span>
            </>
          ) : (
            <>
              <FiShoppingCart size={20} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        <button
          onClick={() => onViewDetails(product._id)}
          className="w-full text-orange-600 border-2 border-orange-600 py-1.5 rounded-lg transition-all duration-300 ease-out font-semibold hover:bg-orange-50 hover:text-orange-700 active:scale-95 text-center text-sm"
          title="View product details"
        >
          Quick View
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
