import axios from 'axios';

// Always ensure /api is present in the base URL
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
let apiBase = BASE_URL;
if (!apiBase.endsWith('/api')) {
  apiBase = apiBase.replace(/\/$/, '') + '/api';
}

const API = axios.create({
  baseURL: apiBase,
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
    // Don't redirect if it's a login failure (let the component handle it)
    if (
      error.response?.status === 401 &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/signup')
    ) {
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
  updateShippingAddress: (id, address) => API.put(`/orders/${id}/address`, { shippingAddress: address }),
  confirmCOD: (id) => API.put(`/orders/${id}/confirm-cod`),
  cancelOrder: (id) => API.delete(`/orders/${id}`),
};

// ============================================
// User Endpoints
// ============================================

export const userAPI = {
  updateProfile: (userId, data) => API.put(`/users/${userId}`, data),
  updatePassword: (data) => API.put('/auth/update-password', data),
};

// ============================================
// Exports
// ============================================

export default API;
