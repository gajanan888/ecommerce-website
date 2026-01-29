import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { SkeletonGrid } from './SkeletonLoader';

const ProductShowcaseSection = ({
  title,
  subtitle,
  category,
  products,
  onAddToCart,
  onViewDetails,
  loading,
  backgroundColor = '#FFFFFF',
  accentColor = '#FF8C00',
  headerIcon = '🛍️',
}) => {
  const displayProducts = products.slice(0, 6);

  return (
    <div
      className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-8"
      style={{ backgroundColor }}
    >
      {/* Category Header with Underline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{headerIcon}</span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ color: '#1a1a1a' }}
          >
            {title}
          </h2>
        </div>

        {/* Decorative Underline */}
        <div className="flex items-center gap-3 mt-3">
          <div
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: accentColor }}
          ></div>
          <p className="text-gray-600 font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <SkeletonGrid columns={6} rows={1} />
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500 text-lg font-medium">
                  No products found in this category
                </p>
              </div>
            )}
          </div>

          {/* View All Button */}
          {displayProducts.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  // This can be connected to filter/navigation logic
                }}
                className="px-8 py-3 rounded-full font-bold text-base flex items-center gap-2 transition-all duration-300 hover:gap-4 group"
                style={{
                  backgroundColor: accentColor,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 12px ${accentColor}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${accentColor}40`;
                }}
              >
                View All {title}
                <FiChevronRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductShowcaseSection;
