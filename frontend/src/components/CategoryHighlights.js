import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const CategoryHighlights = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: 'women',
      name: 'Women',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
      size: 'col-span-1 md:col-span-2 md:row-span-2', // Large Square
      description: 'Elegant styles for every occasion',
    },
    {
      id: 'men',
      name: 'Men',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      size: 'col-span-1 md:row-span-2', // Tall Portrait
      description: 'Timeless essentials',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image:
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=400&fit=crop',
      size: 'col-span-1', // Standard
      description: 'The perfect finish',
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop',
      size: 'col-span-1', // Standard
      description: 'Fresh drops daily',
    },
  ];

  const handleCategoryClick = (categoryId) => {
    const queryParams = {
      men: '?gender=men',
      women: '?gender=women',
      accessories: '?category=accessories',
      'new-arrivals': '?tag=new',
    };
    navigate(`/products${queryParams[categoryId] || ''}`);
  };

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-4">
              COLLECTIONS
            </h2>
            <p className="text-xl text-white/40 font-bold max-w-md uppercase tracking-widest text-xs">
              Explore our curated high-fashion silhouettes.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 font-black text-white/60 hover:text-white transition-all uppercase tracking-widest text-xs"
          >
            Browse All <FiArrowUpRight size={20} />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl ${category.size}`}
            >
              <div className="absolute inset-0 bg-gray-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              </div>

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {category.name}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100">
                      <FiArrowUpRight size={20} />
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 font-bold text-white uppercase tracking-widest text-xs"
          >
            Browse All Categories <FiArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
