// --- 3D ANIMATED PRODUCT CARD ---
import React, { useState, useContext, useRef } from 'react';
import { FiShoppingCart, FiStar, FiHeart, FiEye } from 'react-icons/fi';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showSuccess, showError } = useToast();
  const discount = Number(product.discount) || 0;
  const discountedPrice = Number(product.price) * (1 - discount / 100);
  const inWishlist = isInWishlist(product._id);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAddingToCart(true);
      // Pass full product object to handler
      const result = await onAddToCart(product);
      if (result && result.error) {
        showError(result.error.message || 'Failed to add to cart');
      } else {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (error) {
      showError('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product._id);
      showSuccess(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      showError('Error updating wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group w-full h-[500px] perspective-2000 cursor-none"
      onClick={() => onViewDetails(product._id)}
    >
      <div
        className="absolute inset-0 designer-card flex flex-col"
        style={{ transform: 'translateZ(0px)' }}
      >
        {/* Full Image Background Container */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ transform: 'translateZ(20px)' }}
        >
          <motion.img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 will-change-transform group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          />

          {/* Elegant Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

          {/* Floating High-End Labels */}
          <div className="absolute top-6 left-6 flex flex-col gap-2" style={{ transform: 'translateZ(40px)' }}>
            {product.isNewArrival && (
              <span className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Action - Cinematic Hover State */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="px-8 py-3 bg-white text-black font-black text-xs tracking-[0.3em] rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              VIEW DETAILS
            </div>
          </div>

          {/* Bottom Content Layer */}
          <div
            className="absolute bottom-0 left-0 w-full p-8"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                  {product.category}
                </p>
                <h3 className="text-white font-black text-2xl tracking-tighter leading-tight line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-sm font-bold line-through">
                    ₹{Number(product.price).toFixed(0)}
                  </span>
                  <span className="text-white text-xl font-bold">
                    ₹{discountedPrice.toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className={`p-4 rounded-full transition-all duration-500 ${addingToCart
                    ? 'bg-white/10 text-white/20'
                    : added
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                  }`}
              >
                {added ? <FiStar size={20} className="fill-current" /> : <FiShoppingCart size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
