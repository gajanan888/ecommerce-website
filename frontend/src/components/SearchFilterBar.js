import React, { useState } from 'react';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';

const SearchFilterBar = ({
  onSearch,
  onFilterChange,
  onSortChange,
  categories = ['All', 'Electronics', 'Fashion', 'Books', 'Home', 'Sports'],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange?.({
      category: category === 'All' ? null : category,
      priceRange,
    });
  };

  const handlePriceChange = () => {
    setPriceRange([minPrice, maxPrice]);
    onFilterChange?.({
      category: selectedCategory === 'All' ? null : selectedCategory,
      priceRange: [minPrice, maxPrice],
    });
  };

  const handleSort = (value) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(1000);
    setPriceRange([0, 1000]);
    onSearch?.('');
    onFilterChange?.({
      category: null,
      priceRange: [0, 1000],
    });
    onSortChange?.('newest');
    setSortBy('newest');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-3 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              onSearch?.('');
            }}
            className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

      {/* Filter Toggle (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center gap-2 w-full px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium"
      >
        <FiFilter /> Show Filters {showFilters ? '▼' : '▶'}
      </button>

      {/* Filters (Desktop Always, Mobile Toggle) */}
      <div className={`space-y-6 ${!showFilters && 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
            Category
            <FiChevronDown className="text-gray-400" />
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-orange-600 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-orange-600 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
            Price Range
            <FiChevronDown className="text-gray-400" />
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Min Price: ${minPrice}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                onChangeCapture={handlePriceChange}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                onChangeCapture={handlePriceChange}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-orange-600">${minPrice}</span> -{' '}
                <span className="font-bold text-orange-600">${maxPrice}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
            Sort By
            <FiChevronDown className="text-gray-400" />
          </h3>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
