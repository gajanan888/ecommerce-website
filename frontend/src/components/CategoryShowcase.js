import React from 'react';

const CategoryShowcase = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 1,
      name: 'Women',
      icon: '👗',
      image:
        'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&h=400&fit=crop',
      badge: 'NEW',
    },
    {
      id: 2,
      name: 'Men',
      icon: '👕',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
      badge: 'TRENDING',
    },
    {
      id: 3,
      name: 'Kids',
      icon: '👶',
      image:
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=400&fit=crop',
      badge: 'SALE',
    },
    {
      id: 4,
      name: 'Accessories',
      icon: '🎒',
      image:
        'https://images.unsplash.com/photo-1563062928-e44e4c5e1235?w=500&h=400&fit=crop',
      badge: 'HOT',
    },
  ];

  return (
    <div
      className="px-4 py-8 mx-auto max-w-7xl sm:px-6 md:px-8 sm:py-10 md:py-12"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: '#1a1a1a' }}
          >
            Popular Categories
          </h2>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: '#FF8C00' }}
          ></div>
          <p className="text-gray-600 font-medium">
            Explore our featured collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-5 md:gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.name)}
            className="relative h-56 sm:h-64 md:h-72 overflow-hidden transition-all duration-300 transform shadow-sm group rounded-xl hover:shadow-md hover:scale-102 active:scale-95"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay Gradient - Darker on bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Badge */}
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: '#FF8A00' }}
            >
              {category.badge}
            </div>

            {/* Content - Bottom positioned */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now →
              </p>
            </div>

            {/* Bottom Accent Border */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                backgroundColor: '#FF8A00',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s duration-300',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scaleX(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scaleX(0)';
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;
