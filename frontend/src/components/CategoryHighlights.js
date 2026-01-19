import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryHighlights = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: 'men',
      name: 'Men',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    },
    {
      id: 'women',
      name: 'Women',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image:
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop',
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop',
    },
  ];

  const handleCategoryClick = (categoryId) => {
    // Navigate to products page with appropriate query params
    const queryParams = {
      men: '?gender=men',
      women: '?gender=women',
      accessories: '?category=accessories',
      'new-arrivals': '?tag=new',
    };

    navigate(`/products${queryParams[categoryId] || ''}`);
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Explore styles curated for you
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category.id);
                }
              }}
              aria-label={`Browse ${category.name} collection`}
              className="relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Category Text */}
              <div className="absolute inset-0 flex items-end justify-start p-6 md:p-8">
                <div className="transform transition-all duration-500 ease-out">
                  <h3
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight ${
                      hoveredCategory === category.id
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-90'
                    }`}
                  >
                    {category.name}
                  </h3>
                  <p
                    className={`text-sm text-white/80 font-light mt-2 transition-all duration-500 ease-out ${
                      hoveredCategory === category.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    Explore Collection
                  </p>
                </div>
              </div>

              {/* Bottom Border Accent on Hover */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-500 ease-out ${
                  hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
