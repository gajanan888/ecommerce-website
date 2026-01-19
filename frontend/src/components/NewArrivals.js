import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const NewArrivals = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: 'Minimalist Linen Shirt',
      category: 'Shirts',
      price: 89.99,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    },
    {
      id: 2,
      name: 'Classic White Tee',
      category: 'Basics',
      price: 49.99,
      image:
        'https://images.unsplash.com/photo-1516992654410-330330fc5388?w=500&h=600&fit=crop',
    },
    {
      id: 3,
      name: 'Tailored Black Blazer',
      category: 'Outerwear',
      price: 199.99,
      image:
        'https://images.unsplash.com/photo-1539533057440-7cc28baa34d8?w=500&h=600&fit=crop',
    },
    {
      id: 4,
      name: 'Slim Fit Jeans',
      category: 'Denim',
      price: 129.99,
      image:
        'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=600&fit=crop',
    },
  ];

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    // Add to cart logic here
  };

  const handleViewAll = () => {
    navigate('/new-arrivals');
  };

  return (
    <section
      id="new-arrivals"
      className="w-full pt-0 pb-12 md:pb-16 lg:pb-20 bg-white"
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Fresh styles just dropped
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {products.map((product) => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Wishlist Button */}
                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white"
                  aria-label="Add to wishlist"
                >
                  <FiHeart
                    size={20}
                    className={`transition-all duration-300 ${
                      wishlist[product.id]
                        ? 'fill-gray-900 text-gray-900'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  />
                </button>

                {/* Add to Cart Button - Shows on Hover */}
                {hoveredProduct === product.id && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300">
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  {product.category}
                </p>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 leading-snug hover:text-gray-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button
            onClick={handleViewAll}
            className="px-8 md:px-12 py-4 md:py-5 border-2 border-gray-900 text-gray-900 font-semibold rounded-sm hover:bg-gray-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            View All New Arrivals
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
