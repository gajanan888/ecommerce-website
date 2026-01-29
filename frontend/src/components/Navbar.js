import React, { useState, useEffect, useRef } from 'react';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHeart,
  FiSearch,
  FiFeather,
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const wishlistContext = React.useContext(WishlistContext);
  const wishlistCount = wishlistContext?.wishlistItems?.length || 0;
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const isTransparentHome = location.pathname === '/' && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'New In', path: '/products?tag=new' },
    { name: 'Men', path: '/products?gender=men' },
    { name: 'Women', path: '/products?gender=women' },
    { name: 'Children', path: '/products?gender=children' },
    { name: 'Collections', path: '/products' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 z-50 transition-all duration-700 crystal-island crystal-island-dark border-white/10 ${
          isScrolled ? 'py-1.5' : 'py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-1 font-bold text-2xl tracking-tighter transition-colors duration-500 text-white"
            >
              <FiFeather className="text-3xl text-orange-500" />
              <span className="group-hover:text-orange-500 transition-colors duration-300">
                EliteWear
              </span>
            </Link>

            {/* Center Area (Links or Search) */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <AnimatePresence mode="wait">
                {!searchOpen ? (
                  <motion.div
                    key="links"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-10"
                  >
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="relative group text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 text-white/60 hover:text-white"
                      >
                        {link.name}
                        <span
                          className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full`}
                        />
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md relative"
                  >
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="SEARCH COLLECTION..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      className="w-full pl-12 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                    >
                      <FiX size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`hidden md:flex p-2 rounded-full transition-all ${
                  isTransparentHome
                    ? 'text-white/60 hover:text-white hover:bg-white/10'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                } ${searchOpen ? 'bg-orange-500 text-white' : ''}`}
              >
                {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={`relative p-2 rounded-full transition-all ${
                  isTransparentHome
                    ? 'text-white/40 hover:text-white hover:bg-white/10'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-all ${
                  isTransparentHome
                    ? 'text-white/40 hover:text-white hover:bg-white/10'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div
                  className={`hidden md:flex items-center gap-2 pl-2 border-l ${isTransparentHome ? 'border-white/10' : 'border-gray-200'}`}
                >
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all mr-2 uppercase tracking-wider ${
                        isTransparentHome
                          ? 'bg-white text-black hover:bg-orange-500 hover:text-white'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                      isTransparentHome
                        ? 'text-white hover:bg-white/10'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                    title="View Profile"
                  >
                    <FiUser size={16} />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className={`p-2 rounded-full transition-all ${
                      isTransparentHome
                        ? 'text-white/20 hover:text-red-500'
                        : 'text-white/20 hover:text-red-500'
                    }`}
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    isTransparentHome
                      ? 'bg-white text-black hover:bg-orange-500 hover:text-white'
                      : 'bg-gray-900 text-white hover:bg-orange-600'
                  }`}
                >
                  <FiUser size={18} />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-all ${
                  isTransparentHome
                    ? 'text-white hover:bg-white/10'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0A0A0A] border-t border-white/5 overflow-hidden shadow-2xl"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="relative mb-6 px-4">
                  <FiSearch className="absolute left-7 top-4 text-white/20" />
                  <input
                    type="text"
                    placeholder="SEARCH..."
                    className="w-full bg-white/5 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-white/10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e);
                        setMobileMenuOpen(false);
                      }
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-3">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                            A
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Admin Dashboard</p>
                            <p className="text-xs text-gray-300">
                              Manage Store
                            </p>
                          </div>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {user.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <FiUser className="text-gray-400" size={18} />
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                      >
                        <FiLogOut size={18} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      <FiUser size={18} />
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer to prevent content from going under fixed navbar - Hidden on Home Hero for seamless 3D */}
      {!isTransparentHome && <div className="h-20" />}
    </>
  );
}
