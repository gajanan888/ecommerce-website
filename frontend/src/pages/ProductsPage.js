import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { productAPI } from '../services/api';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';

import { useCart } from '../context/CartContext'; // Switch to CartContext

export default function ProductsPage() {
  const { addToCart } = useCart(); // Use Context
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sorting options
  const getSortedProducts = (products) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  useTitle('Collections | EliteWear - Premium Fashion');

  // Parse URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('gender')) {
      const gender = params.get('gender');
      setActiveFilter({ type: 'gender', value: gender });
      setSelectedCategory(gender.charAt(0).toUpperCase() + gender.slice(1));
    } else if (params.has('category')) {
      const category = params.get('category');
      setActiveFilter({ type: 'category', value: category });
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1));
    } else if (params.has('tag')) {
      const tag = params.get('tag');
      setActiveFilter({ type: 'tag', value: tag });
      setSelectedCategory('New Arrivals');
    } else {
      setActiveFilter(null);
      setSelectedCategory('All');
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        // productAPI.getAll returns response.data which has { data: [...] }
        setProducts(response.data?.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Filter Logic
  const filteredProducts = (() => {
    let results = [...products];

    // 1. Text Search (Global)
    if (searchTerm.trim()) {
      results = results.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Active Object Filters (Category, Price, Tag, Gender)
    if (activeFilter) {
      // Category / Gender / Tag specific logic
      if (activeFilter.type === 'gender') {
        results = results.filter(
          (p) => p.gender?.toLowerCase() === activeFilter.value.toLowerCase()
        );
      } else if (activeFilter.type === 'tag') {
        results = results.filter(
          (p) => p.isNewArrival === true || p.tags?.includes(activeFilter.value)
        );
      }

      // Sidebar Category Filter
      if (activeFilter.category && activeFilter.category !== 'All') {
        results = results.filter(
          (p) =>
            p.category?.toLowerCase() === activeFilter.category.toLowerCase()
        );
      }

      // Sidebar Price Filter
      if (activeFilter.priceRange) {
        const [min, max] = activeFilter.priceRange;
        results = results.filter((p) => p.price >= min && p.price <= max);
      }
    } else {
      // Fallback for direct legacy category selection
      if (selectedCategory && selectedCategory !== 'All') {
        results = results.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    return results;
  })();

  const sortedAndFilteredProducts = getSortedProducts(filteredProducts);

  // Dynamic categories from products
  const categories = [
    'All',
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Editorial Hero */}
      <section className="relative h-[40vh] md:h-[50vh] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
            alt="Collection Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 text-orange-500"
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            The Collection
          </motion.h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <SearchFilterBar
                onSearch={(term) => setSearchTerm(term)}
                onFilterChange={(filters) => {
                  setActiveFilter({
                    ...activeFilter,
                    ...filters,
                  });
                  // If category changes in filter bar, update the simple state too for consistency
                  if (filters.category !== undefined) {
                    setSelectedCategory(filters.category || 'All');
                  }
                }}
                onSortChange={(sort) => setSortBy(sort)}
                categories={categories}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle & Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                Showing{' '}
                <span className="text-white">
                  {sortedAndFilteredProducts.length}
                </span>{' '}
                results
              </p>

              {/* Mobile Sort (Visible only on mobile if Sidebar is hidden/collapsed logic is handled inside SearchFilterBar, 
                  but we can keep a simple sort here if needed, or rely on SearchFilterBar's mobile view) */}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              </div>
            ) : sortedAndFilteredProducts.length > 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {sortedAndFilteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onViewDetails={(id) => navigate(`/product/${id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <FiSearch size={32} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
                  Archive Empty
                </h3>
                <p className="text-white/40 max-w-sm mx-auto mb-10 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  No specimens match your current filter parameters. Refine your
                  search or clear all protocols.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveFilter(null);
                    setSearchTerm('');
                  }}
                  className="px-10 py-5 bg-white text-black font-black rounded-full hover:bg-orange-500 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.2em]"
                >
                  Reset All Protocols
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
