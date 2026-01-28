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
    <div className="bg-[#0A0A0A] rounded-[2rem] border border-white/5 p-8 space-y-10 shadow-2xl">
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="SEARCH COLLECTION"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-14 pr-4 py-5 bg-white/5 border-transparent border rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              onSearch?.('');
            }}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-900"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

      {/* Filter Toggle (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-bold text-sm"
      >
        <span className="flex items-center gap-2"><FiFilter /> Filters</span>
        {showFilters ? <FiChevronDown className="rotate-180 transition-transform" /> : <FiChevronDown className="transition-transform" />}
      </button>

      {/* Filters (Desktop Always, Mobile Toggle) */}
      <div className={`space-y-8 ${!showFilters && 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">
            Categories
          </h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="peer appearance-none w-4 h-4 border border-white/20 rounded-full checked:bg-orange-500 checked:border-orange-500 transition-all"
                  />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedCategory === category ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`}>
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pt-8 border-t border-white/5">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">
            Price Architecture
          </h3>
          <div className="space-y-6">
            {/* Range Inputs for functionality */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[8px] font-black text-white/20 uppercase mb-2 block tracking-widest">Floor</label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  onBlur={handlePriceChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white focus:outline-none focus:border-white/10"
                />
              </div>
              <div className="flex-1">
                <label className="text-[8px] font-black text-white/20 uppercase mb-2 block tracking-widest">Ceiling</label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onBlur={handlePriceChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white focus:outline-none focus:border-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="pt-8 border-t border-white/5">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">
            Protocol Sorting
          </h3>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60"
            >
              <option value="newest" className="bg-[#0A0A0A] text-white">Newest First</option>
              <option value="price-asc" className="bg-[#0A0A0A] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#0A0A0A] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#0A0A0A] text-white">Highest Rated</option>
            </select>
            <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full px-6 py-4 border border-white/5 text-white/40 rounded-2xl hover:bg-white/5 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em]"
        >
          Wipe Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
