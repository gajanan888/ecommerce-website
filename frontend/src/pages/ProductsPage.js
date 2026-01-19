import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import ProductCard from '../components/ProductCardComponent';
import { FiFilter, FiX, FiArrowUp, FiArrowDown, FiStar } from 'react-icons/fi';

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilter, setShowFilter] = useState(false);

  // Featured collections data
  const featuredCollections = [
    {
      id: 'summer',
      name: 'Summer Essentials',
      tagline: 'Light, breezy, and perfect for warm days',
      image:
        'https://images.unsplash.com/photo-1506629082632-c83be83b5754?w=1200&h=600&fit=crop&q=80',
      filterType: 'tag',
      filterValue: 'summer',
    },
    {
      id: 'denim',
      name: 'Denim Collection',
      tagline: 'Timeless denim styles for everyone',
      image:
        'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=1200&h=600&fit=crop&q=80',
      filterType: 'category',
      filterValue: 'jeans',
    },
    {
      id: 'new',
      name: 'New Arrivals',
      tagline: 'Discover the latest fashion trends',
      image:
        'https://images.unsplash.com/photo-1550777292-8490f6fb0444?w=1200&h=600&fit=crop&q=80',
      filterType: 'tag',
      filterValue: 'new',
    },
  ];

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

  // Update page title based on active filter
  const getPageTitle = () => {
    if (activeFilter?.type === 'tag' && activeFilter?.value === 'new') {
      return 'New Arrivals | StyleHub - Premium Fashion Store';
    }
    return 'Collections | StyleHub - Premium Fashion Store';
  };

  useTitle(getPageTitle());

  // Parse URL query params on component mount and route change
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.has('gender')) {
      const gender = params.get('gender');
      setActiveFilter({ type: 'gender', value: gender });
      setSelectedCategory(gender === 'men' ? 'Men' : 'Women');
    } else if (params.has('category')) {
      const category = params.get('category');
      setActiveFilter({ type: 'category', value: category });
      setSelectedCategory('Accessories');
    } else if (params.has('tag')) {
      const tag = params.get('tag');
      setActiveFilter({ type: 'tag', value: tag });
      setSelectedCategory('All');
    } else {
      setActiveFilter(null);
      setSelectedCategory('All');
    }
  }, [location.search]);

  // Scroll detection for filter visibility
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.65; // Hero section is 65vh
      setShowFilter(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Jackets'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products`);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters based on active filter or selected category
  const filteredProducts = (() => {
    let results = [];

    if (activeFilter) {
      if (activeFilter.type === 'gender') {
        results = products.filter(
          (product) =>
            product.gender?.toLowerCase() === activeFilter.value.toLowerCase()
        );
      } else if (activeFilter.type === 'category') {
        results = products.filter(
          (product) =>
            product.category?.toLowerCase() === activeFilter.value.toLowerCase()
        );
      } else if (activeFilter.type === 'tag') {
        // For new arrivals, filter by isNew flag or tags array
        results = products.filter(
          (product) =>
            product.isNew === true || product.tags?.includes(activeFilter.value)
        );
      }
    } else {
      results =
        selectedCategory === 'All'
          ? products
          : products.filter((product) => product.category === selectedCategory);
    }

    // Apply search filter within the current results
    if (searchTerm.trim()) {
      results = results.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return results;
  })();

  // Apply sorting
  const sortedAndFilteredProducts = getSortedProducts(filteredProducts);

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Collections Hero Header */}
      <section className="relative w-full h-[65vh] bg-white overflow-hidden flex flex-col md:flex-row">
        {/* Background Gradient Accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-slate-50 blur-3xl opacity-40"></div>
        </div>

        {/* Mobile Image */}
        <div className="flex-shrink-0 w-full h-48 overflow-hidden bg-slate-200 md:hidden">
          <img
            src="https://m.media-amazon.com/images/I/71lJ7hC4tBL._AC_UF894%2C1000_QL80_.jpg"
            alt="Fashion Collections"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Left Column - Content */}
        <div className="relative flex flex-col justify-center flex-1 w-full px-6 py-8 sm:px-8 md:px-12 lg:px-16 md:py-0 md:h-full">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex flex-shrink-0 items-center gap-2 mb-6 w-fit text-xs md:text-sm"
          >
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">Collections</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0 mb-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl md:mb-6"
          >
            Explore Our
            <br />
            Collections
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-shrink-0 max-w-lg mb-8 text-lg font-light leading-relaxed text-slate-600 sm:text-xl md:mb-10"
          >
            Curated selections of premium fashion pieces designed for effortless
            style.
          </motion.p>

          {/* Quick Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-shrink-0 inline-flex items-center gap-3 text-sm text-slate-600"
          >
            <div className="flex-shrink-0 w-1 h-1 bg-slate-900 rounded-full"></div>
            <span>Browse by category or discover new arrivals</span>
          </motion.div>
        </div>

        {/* Right Column - Image (Desktop only) */}
        <div className="relative hidden md:flex md:w-1/2 md:h-full overflow-hidden pr-6 lg:pr-12">
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20 z-10"></div>

          {/* Image */}
          <img
            src="https://m.media-amazon.com/images/I/71lJ7hC4tBL._AC_UF894%2C1000_QL80_.jpg"
            alt="Fashion Collections"
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>
      </section>

      {/* Category Filter */}
      {showFilter && (
        <section className="bg-white sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-5 md:py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Category Filter Container */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-slate-50 rounded-2xl p-3 md:p-4 border border-slate-200 flex flex-wrap gap-2.5 w-full sm:w-auto"
                >
                  {categories.map((category, index) => {
                    const isActive = selectedCategory === category;
                    return (
                      <motion.button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setActiveFilter(null);
                          setSearchTerm('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedCategory(category);
                            setActiveFilter(null);
                            setSearchTerm('');
                          }
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.08,
                          duration: 0.5,
                        }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        aria-pressed={isActive}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-lg hover:shadow-xl focus:ring-slate-900'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md focus:ring-slate-400'
                        }`}
                      >
                        {category}
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Search Input */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="relative w-full sm:w-auto sm:flex-1"
                >
                  <input
                    type="text"
                    placeholder={
                      activeFilter?.type === 'tag'
                        ? 'Search new arrivals...'
                        : selectedCategory !== 'All'
                        ? `Search ${selectedCategory.toLowerCase()}...`
                        : 'Search products...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-300 bg-white text-slate-700 placeholder-slate-400"
                    aria-label="Search products"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Active Filter Badge */}
            {activeFilter && (
              <div className="flex items-center gap-3 pt-5 pb-2 animate-slideDown">
                <FiFilter size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-600">
                  Active:
                </span>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-semibold text-amber-900">
                    {activeFilter.type === 'gender' &&
                      `${
                        activeFilter.value.charAt(0).toUpperCase() +
                        activeFilter.value.slice(1)
                      } Collection`}
                    {activeFilter.type === 'category' &&
                      activeFilter.value.charAt(0).toUpperCase() +
                        activeFilter.value.slice(1)}
                    {activeFilter.type === 'tag' && 'New Arrivals'}
                  </span>
                  <button
                    onClick={() => {
                      setActiveFilter(null);
                      setSelectedCategory('All');
                      setSearchTerm('');
                    }}
                    className="ml-2 text-amber-700 hover:text-amber-900 hover:bg-amber-200 rounded-full p-1 transition-all duration-200"
                    aria-label="Clear filter"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
        {/* Featured Collections Section */}
        {!activeFilter && selectedCategory === 'All' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                Featured Collections
              </h2>
              <p className="text-slate-600 text-lg">
                Explore our curated selections of premium fashion
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  onClick={() => {
                    if (collection.filterType === 'category') {
                      setSelectedCategory(
                        collection.filterValue.charAt(0).toUpperCase() +
                          collection.filterValue.slice(1)
                      );
                      setActiveFilter(null);
                    } else {
                      setActiveFilter({
                        type: collection.filterType,
                        value: collection.filterValue,
                      });
                      setSelectedCategory('All');
                    }
                    setSearchTerm('');
                  }}
                  className="cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Background Image */}
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Dark Overlay */}
                    <motion.div
                      initial={{ opacity: 0.3 }}
                      whileHover={{ opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black/30 group-hover:bg-black/50"
                    ></motion.div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-2"
                      >
                        {collection.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-sm font-light text-white/90"
                      >
                        {collection.tagline}
                      </motion.p>
                    </div>

                    {/* Zoom Icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 right-4 bg-white rounded-full p-3 z-20"
                    >
                      <svg
                        className="w-5 h-5 text-slate-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Products List */}
        {!loading && !error && (
          <>
            <div className="mb-10 flex items-center justify-between">
              <p className="text-slate-700 text-sm md:text-base">
                {activeFilter && (
                  <span className="inline-block mb-2">
                    <span className="font-semibold text-slate-900">
                      {activeFilter.type === 'gender' &&
                        `${
                          activeFilter.value.charAt(0).toUpperCase() +
                          activeFilter.value.slice(1)
                        } Collection`}
                      {activeFilter.type === 'category' &&
                        `${
                          activeFilter.value.charAt(0).toUpperCase() +
                          activeFilter.value.slice(1)
                        }`}
                      {activeFilter.type === 'tag' && 'New Arrivals'}
                    </span>
                    {' — '}{' '}
                  </span>
                )}
                <span className="font-semibold text-gray-900 text-base">
                  {sortedAndFilteredProducts.length}
                </span>{' '}
                {sortedAndFilteredProducts.length !== 1
                  ? 'products'
                  : 'product'}{' '}
                found
              </p>
            </div>

            {sortedAndFilteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {sortedAndFilteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="no-underline block h-full"
                    >
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 md:py-32 animate-fadeIn">
                <div className="text-7xl md:text-8xl mb-6">
                  {searchTerm ? '🔍' : '🛍️'}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {searchTerm
                    ? 'No products found'
                    : activeFilter?.type === 'tag' &&
                      activeFilter?.value === 'new'
                    ? 'No new arrivals yet'
                    : 'No products found'}
                </h2>
                <p className="text-slate-600 mb-10 text-lg max-w-xl mx-auto">
                  {searchTerm
                    ? `Try adjusting your search term to find what you're looking for.`
                    : activeFilter?.type === 'tag' &&
                      activeFilter?.value === 'new'
                    ? 'Check back soon for the latest arrivals!'
                    : 'Try adjusting your filters to find what you are looking for.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveFilter(null);
                    setSearchTerm('');
                    setSortBy('featured');
                  }}
                  className="inline-block px-10 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View All Products
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
