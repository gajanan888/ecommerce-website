import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.signup(data);
      const { user } = response.data.data;
      setToken('cookie');
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data);
      const { user } = response.data.data;
      setToken('cookie');
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Merge guest cart with user cart after login
      const guestCart = localStorage.getItem('stylehub_cart');
      if (guestCart) {
        try {
          const guestCartItems = JSON.parse(guestCart);
          if (guestCartItems.length > 0) {
            // Store guest cart to merge in CartContext
            localStorage.setItem('guestCartToMerge', guestCart);
          }
        } catch (error) {
          // Failed to parse guest cart
        }
      }

      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout().catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getMe();
        const userData = response.data.data.user;
        setToken('cookie');
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // An anonymous session is expected to receive 401 from /auth/me.
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
