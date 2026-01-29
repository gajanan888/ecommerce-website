import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { cartAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'stylehub_cart';

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on app start
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Failed to save cart to localStorage
    }
  }, [cart]);

  // Sync with backend on login
  useEffect(() => {
    if (isAuthenticated) {
      const fetchServerCart = async () => {
        try {
          // If we have a local guest cart that needs merging
          const guestCartToMerge = localStorage.getItem('guestCartToMerge');
          if (guestCartToMerge) {
            const guestItems = JSON.parse(guestCartToMerge);
            // Upload guest items to server
            // We run these sequentially or parallel
            for (const item of guestItems) {
              await cartAPI.addToCart({
                productId: item.id || item._id, // Handle different ID formats
                quantity: item.quantity,
                size: item.size,
              });
            }
            localStorage.removeItem('guestCartToMerge');
            localStorage.removeItem(CART_STORAGE_KEY); // Clear local only storage as we switch to server source
          }

          // Fetch latest cart from server
          const response = await cartAPI.getCart();
          const serverItems = response.data.data?.items || [];

          // Transform server items to match frontend structure if needed
          // Server: { productId: Object, quantity, size, ... }
          // Frontend: { id, name, price, image, quantity, size ... }
          const formattedCart = serverItems
            .filter((item) => item.productId && item.productId._id) // Filter out invalid/deleted products
            .map((item) => ({
              id: item.productId._id,
              name: item.productId.name || 'Unknown Product',
              price: item.productId.price || 0,
              image: item.productId.image || '',
              category: item.productId.category || 'Uncategorized',
              quantity: item.quantity,
              size: item.size,
            }));

          console.log(
            `🛒 CartContext - Fetched ${formattedCart.length} valid items from server`
          );

          setCart(formattedCart);
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      };

      fetchServerCart();
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (product, quantity = 1, size = 'M') => {
      // Optimistic Update
      setCart((prevCart) => {
        // Handle both _id (MongoDB) and id formats
        const productId = product._id || product.id;
        const existingItem = prevCart.find(
          (item) => item.id === productId && item.size === size
        );

        if (existingItem) {
          return prevCart.map((item) =>
            item.id === productId && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [
            ...prevCart,
            {
              id: productId,
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

      // Backend Sync
      if (isAuthenticated) {
        try {
          console.log('🔄 Syncing to backend:', product.name);
          await cartAPI.addToCart({
            productId: product._id || product.id,
            quantity,
            size,
          });
          console.log('✅ Synced to backend');
        } catch (error) {
          console.error('❌ Failed to add to server cart:', error);
          // Ideally revert optimistic update here on failure
        }
      }
    },
    [isAuthenticated]
  );

  // Remove product from cart
  const removeFromCart = useCallback(
    async (productId, size) => {
      // Find the item to get its cart-item _id if needed, but backend API might use productId+size or cartItemId
      // Looking at backend controller: delete /remove/:itemId (which is the subdocument ID in the cart array)
      // This is tricky: frontend usually knows ProductID, but backend delete wants CartItemID.
      // We must map it correctly. Or update backend to allow delete by ProductID+Size.
      // Let's see the cart structure from server.
      // Actually, for now, let's just assume we delete locally. But we need to sync!
      // The current backend implementation: router.delete('/remove/:itemId', protect, removeFromCart);
      // We need the Cart Item's _id (the subdocument id).
      // When we fetched from server, we probably didn't store the subdoc ID in 'formattedCart'.
      // Correct approach: Update 'formattedCart' to include `_id` (cart item id).

      setCart((prevCart) =>
        prevCart.filter(
          (item) => !(item.id === productId && item.size === size)
        )
      );

      if (isAuthenticated) {
        try {
          // We need to re-fetch or find the item to get its backend ID.
          // For robustness, let's just re-fetch the cart after a short delay or rely on the fact that
          // we should have stored the cart item ID.
          // Since we didn't store it yet, let's refetch.
          // Better: Change backend to delete by product ID? No, strictly itemId is better.
          // Let's refresh cart from server.
          const response = await cartAPI.getCart();
          const items = response.data.data?.items || [];
          const itemToDelete = items.find(
            (i) => i.productId._id === productId && i.size === size
          );

          if (itemToDelete) {
            await cartAPI.removeItem(itemToDelete._id);
          }
        } catch (error) {
          console.error('Failed to remove from server cart', error);
        }
      }
    },
    [isAuthenticated]
  );

  // Increase quantity of item
  const increaseQuantity = useCallback(
    async (productId, size) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      if (isAuthenticated) {
        try {
          // Need cart item ID again.
          // Quick fix: Fetch cart to get IDs.
          const response = await cartAPI.getCart();
          const items = response.data.data?.items || [];
          const itemToUpdate = items.find(
            (i) => i.productId._id === productId && i.size === size
          );

          if (itemToUpdate) {
            await cartAPI.updateItem(
              itemToUpdate._id,
              itemToUpdate.quantity + 1
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [isAuthenticated]
  );

  // Decrease quantity of item
  const decreaseQuantity = useCallback(
    async (productId, size) => {
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.id === productId && item.size === size
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );

      if (isAuthenticated) {
        try {
          const response = await cartAPI.getCart();
          const items = response.data.data?.items || [];
          const itemToUpdate = items.find(
            (i) => i.productId._id === productId && i.size === size
          );

          if (itemToUpdate) {
            if (itemToUpdate.quantity > 1) {
              await cartAPI.updateItem(
                itemToUpdate._id,
                itemToUpdate.quantity - 1
              );
            } else {
              await cartAPI.removeItem(itemToUpdate._id);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [isAuthenticated]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setCart([]);
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated]);

  // Merge guest cart into user cart (after login) - DEPRECATED here, handled in useEffect
  const mergeGuestCart = useCallback(() => {}, []);

  // Save cart to database - DEPRECATED, handled automatically
  const saveCartToDatabase = useCallback(() => {}, []);

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
