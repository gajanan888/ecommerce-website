import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } =
    useContext(WishlistContext);
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch products for wishlist items
  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        return;
      }

      setProductsLoading(true);
      try {
        const response = await productAPI.getAll();
        const allProducts = response.data.data || [];
        // Filter products that are in wishlist
        const wishlistProducts = allProducts.filter((p) =>
          wishlistItems.includes(p._id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistItems]);

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    showSuccess('Removed from wishlist');
  };

  const handleClearWishlist = () => {
    if (
      window.confirm('Are you sure you want to clear your entire wishlist?')
    ) {
      clearWishlist();
      showSuccess('Wishlist cleared');
    }
  };

  const onAddToCart = async (product) => {
    try {
      await addToCart(product);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };

  const onViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
            Synchronizing...
          </p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-5xl font-black mb-4 text-white uppercase tracking-tighter">
            VAULT EMPTY
          </h2>
          <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
            Your saved artifacts will appear here.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-black px-10 py-5 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl"
          >
            Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter">
              VAULT
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">
              {wishlistItems.length} SELECTION
              {wishlistItems.length !== 1 ? 'S' : ''}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-white/40 hover:text-red-500 transition-colors font-black text-[8px] uppercase tracking-[0.3em] border-b border-transparent hover:border-red-500 pb-1"
            >
              Wipe Vault
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {wishlistItems.length > 0 && (
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Ready to checkout some of these items?
            </p>
            <button
              onClick={() => navigate('/cart')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium inline-flex items-center gap-2"
            >
              <FiShoppingCart size={20} />
              Go to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
