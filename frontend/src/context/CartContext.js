import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'stylehub_cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on app start
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Failed to save cart to localStorage
    }
  }, [cart]);

  // Handle guest cart merge after login
  useEffect(() => {
    const guestCartToMerge = localStorage.getItem('guestCartToMerge');
    if (guestCartToMerge) {
      try {
        const guestItems = JSON.parse(guestCartToMerge);
        if (guestItems.length > 0) {
          setCart((prevCart) => {
            let mergedCart = [...prevCart];

            guestItems.forEach((guestItem) => {
              const existingIndex = mergedCart.findIndex(
                (item) =>
                  item.id === guestItem.id && item.size === guestItem.size
              );

              if (existingIndex > -1) {
                mergedCart[existingIndex] = {
                  ...mergedCart[existingIndex],
                  quantity:
                    mergedCart[existingIndex].quantity + guestItem.quantity,
                };
              } else {
                mergedCart.push(guestItem);
              }
            });

            return mergedCart;
          });
        }
        // Clear the merge flag after processing
        localStorage.removeItem('guestCartToMerge');
      } catch (error) {
        // Failed to merge guest cart
      }
    }
  }, []);
  const addToCart = useCallback((product, quantity = 1, size = 'M') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        // If product with same size exists, increase quantity
        return prevCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity,
            size,
          },
        ];
      }
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.size === size))
    );
  }, []);

  // Increase quantity of item
  const increaseQuantity = useCallback((productId, size) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decrease quantity of item
  const decreaseQuantity = useCallback((productId, size) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Merge guest cart into user cart (after login)
  const mergeGuestCart = useCallback((userCart) => {
    setCart((prevCart) => {
      // Start with user's cart items
      let mergedCart = [...userCart];

      // Merge guest cart items
      prevCart.forEach((guestItem) => {
        const existingIndex = mergedCart.findIndex(
          (item) => item.id === guestItem.id && item.size === guestItem.size
        );

        if (existingIndex > -1) {
          // Item exists, add quantities
          mergedCart[existingIndex] = {
            ...mergedCart[existingIndex],
            quantity: mergedCart[existingIndex].quantity + guestItem.quantity,
          };
        } else {
          // New item, add to cart
          mergedCart.push(guestItem);
        }
      });

      return mergedCart;
    });
  }, []);

  // Save cart to database (for logged-in users)
  const saveCartToDatabase = useCallback(
    async (userId) => {
      try {
        // This would be called after login to sync guest cart
        // Backend will handle the actual save
        return cart;
      } catch (error) {
        // Failed to save cart to database
      }
    },
    [cart]
  );

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping on orders over $100
    const total = subtotal + tax + shipping;

    return {
      itemCount,
      subtotal,
      tax,
      shipping,
      total,
    };
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    mergeGuestCart,
    saveCartToDatabase,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
