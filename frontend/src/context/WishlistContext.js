import React, { createContext, useState, useCallback, useEffect } from 'react';

export const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'stylehub_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = useCallback((items) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      setWishlistItems(items);
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, []);

  // Add product to wishlist
  const addToWishlist = useCallback(
    (productId) => {
      setLoading(true);
      try {
        if (!wishlistItems.includes(productId)) {
          const updated = [...wishlistItems, productId];
          saveWishlist(updated);
          return { success: true, message: 'Added to wishlist' };
        }
        return { success: true, message: 'Already in wishlist' };
      } finally {
        setLoading(false);
      }
    },
    [wishlistItems, saveWishlist]
  );

  // Remove product from wishlist
  const removeFromWishlist = useCallback(
    (productId) => {
      setLoading(true);
      try {
        const updated = wishlistItems.filter((id) => id !== productId);
        saveWishlist(updated);
        return { success: true, message: 'Removed from wishlist' };
      } finally {
        setLoading(false);
      }
    },
    [wishlistItems, saveWishlist]
  );

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems]
  );

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    (productId) => {
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setLoading(true);
    try {
      saveWishlist([]);
      return { success: true, message: 'Wishlist cleared' };
    } finally {
      setLoading(false);
    }
  }, [saveWishlist]);

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
