import React, { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const WishlistPage = ({ onNavigate, onAddToCart, onViewDetails }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } =
    useContext(WishlistContext);
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

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add items to your wishlist to save them for later. You can access
            them anytime!
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 font-medium inline-flex items-center gap-2"
          >
            <FiShoppingCart size={18} />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ❤️ My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}{' '}
              saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FiTrash2 size={18} />
              Clear All
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
              onClick={() => onNavigate('/cart')}
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
