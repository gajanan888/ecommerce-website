import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900 text-gray-300 mt-12 md:mt-16"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8 md:py-10">
        {/* Main Footer Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: '#FFFFFF' }}
            >
              <span className="text-xl">👗</span>
              StyleHub
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium fashion destination with curated collections and timeless
              styles.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              className="text-sm font-bold mb-4 uppercase"
              style={{ color: '#FFFFFF' }}
            >
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-sm font-bold mb-4 uppercase"
              style={{ color: '#FFFFFF' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition duration-200 text-sm"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3
              className="text-sm font-bold mb-4 uppercase"
              style={{ color: '#FFFFFF' }}
            >
              Follow Us
            </h3>
            <div className="flex gap-3">
              <button
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white transition duration-300 flex items-center justify-center"
                aria-label="Facebook"
              >
                <FiFacebook size={16} />
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white transition duration-300 flex items-center justify-center"
                aria-label="Twitter"
              >
                <FiTwitter size={16} />
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white transition duration-300 flex items-center justify-center"
                aria-label="Instagram"
              >
                <FiInstagram size={16} />
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white transition duration-300 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {currentYear} StyleHub. All rights reserved.</p>
            <div className="flex gap-4">
              <button
                onClick={(e) => e.preventDefault()}
                className="hover:text-orange-500 transition duration-200"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={(e) => e.preventDefault()}
                className="hover:text-orange-500 transition duration-200"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
