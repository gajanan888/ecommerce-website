import axios from 'axios';

// Create Axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// Auth Endpoints
// ============================================

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  refreshToken: (refreshToken) =>
    API.post('/auth/refresh-token', { refreshToken }),
};

// ============================================
// Product Endpoints
// ============================================

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  search: (query) => API.get('/products', { params: { search: query } }),
};

// ============================================
// Cart Endpoints
// ============================================

export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/add', data),
  updateItem: (itemId, quantity) =>
    API.put(`/cart/update/${itemId}`, { quantity }),
  removeItem: (itemId) => API.delete(`/cart/remove/${itemId}`),
  clearCart: () => API.delete('/cart/clear'),
};

// ============================================
// Order Endpoints
// ============================================

export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrder: (id, data) => API.put(`/orders/${id}`, data),
  cancelOrder: (id) => API.delete(`/orders/${id}`),
};

// ============================================
// Exports
// ============================================

export default API;
