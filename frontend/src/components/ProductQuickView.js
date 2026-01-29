import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showSuccess, showError } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // wishlistLoading is used for the toggle action
  const [, setWishlistLoading] = useState(false);
  const [heartBeat, setHeartBeat] = useState(false);

  if (!isOpen || !product) return null;

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const images =
    product.images?.length > 0
      ? product.images
      : [product.image || FALLBACK_IMAGE];
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      // Pass the product object, quantity, and a default size if not available
      await addToCart(product, quantity, product.sizes?.[0] || 'M');
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
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group lg:scale-125"
            >
              <FiX
                className="text-white group-hover:rotate-90 transition-transform duration-500"
                size={24}
              />
            </button>

            {/* Left - Visuals */}
            <div className="md:w-1/2 relative bg-[#111] overflow-hidden group">
              <img
                src={getImageUrl(images[currentImageIndex] || images[0])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

              {/* Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                {product.isNewArrival && (
                  <span className="bg-white text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-2xl">
                    NEW SPECIMEN
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-2xl">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails Overlay */}
              {images.length > 1 && (
                <div className="absolute bottom-8 left-8 right-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-500 ${currentImageIndex === index
                        ? 'border-orange-500 scale-110 shadow-lg'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        className="w-full h-full object-cover"
                        alt={`view-${index}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Architecture */}
            <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">
                    {product.category || 'COLLECTION'}
                  </p>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-6">
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-black text-white">
                        ₹{discountedPrice.toFixed(0)}
                      </span>
                      {product.price > discountedPrice && (
                        <span className="text-xl text-white/20 line-through">
                          ₹{product.price.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2">
                      <FiStar
                        className="text-orange-500 fill-current"
                        size={16}
                      />
                      <span className="text-sm font-black text-white">
                        {product.avgRating || '4.8'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  {product.description?.substring(0, 180)}...
                </p>

                {/* Specs Refinement */}
                <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
                  <div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">
                      Availability
                    </span>
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      {product.stock > 0
                        ? `${product.stock} IN STOCK`
                        : 'OUT OF STOCK'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">
                      Global Shipping
                    </span>
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      EXPRESS DELIVERY
                    </span>
                  </div>
                </div>

                {/* Action System */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !product.stock || added}
                      className={`flex-1 group relative py-6 px-8 rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 ${added
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {addingToCart ? (
                          <div className="w-5 h-5 border-2 border-orange-500 border-t-white rounded-full animate-spin" />
                        ) : added ? (
                          <>SPECIMEN ADDED</>
                        ) : (
                          <>
                            ACQUIRE NOW <FiShoppingCart size={18} />
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      className={`p-6 rounded-full border border-white/10 transition-all duration-500 ${inWishlist
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <FiHeart
                        size={24}
                        className={`${inWishlist ? 'fill-current' : ''} ${heartBeat ? 'animate-heartbeat' : ''}`}
                      />
                    </button>
                  </div>

                  <p className="text-center text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
                    Digital grade security guaranteed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes heartbeat {
              0%, 100% { transform: scale(1); }
              25% { transform: scale(1.2); }
              50% { transform: scale(1.1); }
            }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            .animate-slideUp { animation: slideUp 0.3s ease-out; }
            .animate-heartbeat { animation: heartbeat 0.6s ease-out; }
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
