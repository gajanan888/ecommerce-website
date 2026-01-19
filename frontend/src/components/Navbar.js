import React, { useState, useEffect, useRef } from 'react';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHeart,
  FiSearch,
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 font-bold text-2xl md:text-4xl text-gray-900 hover:text-orange-600 transition-colors"
              aria-label="StyleHub home"
            >
              StyleHub
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/products?tag=new"
                className="text-base font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all py-2 px-3 rounded-lg border-b-2 border-orange-600"
                aria-label="Shop New Arrivals"
              >
                New In
              </Link>
              <Link
                to="/products?gender=men"
                className="text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all py-2 px-3 rounded-lg"
                aria-label="Shop Men's Collection"
              >
                Men
              </Link>
              <Link
                to="/products?gender=women"
                className="text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all py-2 px-3 rounded-lg"
                aria-label="Shop Women's Collection"
              >
                Women
              </Link>
              <Link
                to="/products"
                className="text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all py-2 px-3 rounded-lg"
                aria-label="View All Collections"
              >
                Collections
              </Link>
            </div>

            {/* Right Side - Search, Wishlist, Cart, Auth */}
            <div className="flex items-center space-x-6">
              {/* Expandable Search - Desktop Only */}
              <div className="hidden md:flex items-center">
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-3 bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all rounded-full shadow-sm hover:shadow-md"
                    aria-label="Search products"
                  >
                    <FiSearch size={24} />
                  </button>
                ) : (
                  <div className="flex items-center bg-white border-2 border-orange-600 rounded-full px-4 py-3 w-64 shadow-lg">
                    <FiSearch className="text-orange-600 mr-2" size={22} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products, brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      className="bg-transparent outline-none text-base w-full text-gray-700 placeholder-gray-400"
                      aria-label="Search input"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="ml-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-1 rounded-full transition-all"
                      aria-label="Close search"
                    >
                      <FiX size={22} />
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Icon with Badge */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-all rounded-lg"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <FiHeart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Badge */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-all rounded-lg"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <FiShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth - Desktop */}
              {user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-base text-gray-700 font-medium">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-all rounded-lg"
                    aria-label="Logout"
                  >
                    <FiLogOut size={24} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 text-base font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Login"
                >
                  <FiUser size={24} />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full"
                  aria-label="Mobile search input"
                />
                <FiSearch size={22} className="text-gray-500" />
              </div>

              {/* Mobile Nav Links */}
              <Link
                to="/products?tag=new"
                className="block text-base font-semibold text-orange-600 hover:text-orange-700 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                New In
              </Link>
              <Link
                to="/products?gender=men"
                className="block text-base font-medium text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                to="/products?gender=women"
                className="block text-base font-medium text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                to="/products"
                className="block text-base font-medium text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>

              <hr className="my-4" />

              {/* Mobile Auth */}
              {user ? (
                <>
                  <div className="text-base font-medium text-gray-700 py-2">
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-orange-600 py-2"
                  >
                    <FiLogOut size={24} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-base font-semibold text-center text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
