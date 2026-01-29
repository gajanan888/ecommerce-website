import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useTitle } from '../hooks/useTitle';
import { productAPI } from '../services/api';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils';
import SizeGuideModal from '../components/SizeGuideModal';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    productAPI
      .getById(id)
      .then((res) => {
        setProduct(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setIsLoading(false);
      });
  }, [id]);

  const isValidProduct =
    product &&
    product.image &&
    product.name &&
    product.category &&
    typeof product.price === 'number' &&
    product.description;

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  // Set page title based on product
  useTitle(
    isValidProduct
      ? `${product.name} | EliteWear - Premium Fashion Store`
      : 'Product Not Found | EliteWear'
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
      <main className="min-h-screen bg-[#0A0A0A] pt-16 md:pt-20">
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
  if (notFound || !isValidProduct) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-16 md:pt-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">
            Specimen Not Found
          </h1>
          <p className="text-white/40 mb-12 uppercase tracking-widest text-xs font-bold leading-relaxed">
            {notFound
              ? 'We could not locate the requested architectural specimen in our digital archive.'
              : 'Invalid specimen identifier. Please verify the protocol/URL.'}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <FiArrowLeft size={16} />
            Collections Archive
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-24 md:pt-32">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-2 md:py-2 border-b border-white/10">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
        >
          <FiArrowLeft size={20} />
          <span className="text-sm font-black uppercase tracking-widest">
            Back to Collections
          </span>
        </button>
      </div>

      {/* Product Container */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Left: Product Image */}
          <div className="flex items-center justify-center bg-white/5 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover aspect-[3/4]"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-2">
            {/* Category */}
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black mb-4">
              {product.category}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
              {product.name}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-white mb-6">
              ₹{product.price.toFixed(0)}
            </p>

            <p className="text-base text-white/60 leading-relaxed mb-8 max-w-xl">
              {product.description}
            </p>

            {/* Designer Architecture - Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12 border-y border-white/5 mb-12">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-orange-500 font-black text-xs">01</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">
                    Architecture
                  </p>
                  <p className="text-[11px] text-white font-black uppercase">
                    Pure Cotton
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-orange-500 font-black text-xs">02</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">
                    Transit
                  </p>
                  <p className="text-[11px] text-white font-black uppercase">
                    Express Air
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-orange-500 font-black text-xs">03</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">
                    Ethical
                  </p>
                  <p className="text-[11px] text-white font-black uppercase">
                    Sustainable
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-orange-500 font-black text-xs">04</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">
                    Origin
                  </p>
                  <p className="text-[11px] text-white font-black uppercase">
                    Elite Craft
                  </p>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <label className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    Select Size
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] text-white/40 font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                {sizeError && (
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest animate-pulse">
                    Please select a size
                  </span>
                )}
              </div>

              <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
              />

              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`py-4 px-2 text-xs font-black tracking-widest transition-all duration-300 rounded-xl ${
                      selectedSize === size
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
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
            <div className="flex gap-2 mb-4">
              {/* Add to Cart - Primary */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-5 px-6 font-black tracking-[0.3em] text-[10px] uppercase transition-all duration-500 active:scale-95 rounded-full ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                }`}
                aria-label={`Add ${product?.name} to cart`}
              >
                {addedToCart ? '✓ Added' : 'Add to Cart'}
              </button>

              {/* Wishlist - Secondary */}
              <button
                onClick={() => {
                  try {
                    toggleWishlist(product._id);
                    showSuccess(
                      isInWishlist(product._id)
                        ? 'Removed from wishlist'
                        : 'Added to wishlist'
                    );
                  } catch (error) {
                    showError('Error updating wishlist');
                  }
                }}
                title={
                  isInWishlist(product._id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
                className={`py-4 px-6 border-2 transition-colors duration-300 ${
                  isInWishlist(product._id)
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-300 text-gray-400 hover:border-black hover:text-black'
                }`}
                aria-label={
                  isInWishlist(product._id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
              >
                <FiHeart
                  size={24}
                  className={
                    isInWishlist(product._id) ? 'fill-current text-red-500' : ''
                  }
                />
              </button>
            </div>

            {/* Premium Trust Architecture */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 border-t border-white/5 mt-12">
              {[
                { label: 'AUTHENTICITY', detail: 'VERIFIED GRADE' },
                { label: 'RETURNS', detail: '30 DAY WINDOW' },
                { label: 'SECURITY', detail: 'ENCRYPTED' },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500 group"
                >
                  <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 mb-2 group-hover:translate-x-1 transition-transform">
                    {badge.label}
                  </p>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">
                    {badge.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product._id}
          category={product.category}
        />
      </section>
    </main>
  );
}
