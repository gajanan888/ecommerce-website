import axios from 'axios';

// Hardcoded to fix env variable issue
const API_BASE_URL = 'http://localhost:5000/api';

console.log('🌐 Admin API Base URL:', API_BASE_URL);

// Create axios instance with JWT token
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  // For multipart, axios sets the correct Content-Type with boundary automatically

  return headers;
};

// ============================================
// PRODUCT API
// ============================================

export const adminProductAPI = {
  // Get all products (admin view)
  getAll: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await axios.get(
        `${API_BASE_URL}/admin/products?${params}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create product
  create: async (data) => {
    try {
      const isMultipart = data instanceof FormData;
      const response = await axios.post(
        `${API_BASE_URL}/admin/products`,
        data,
        { headers: getHeaders(isMultipart) }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  update: async (id, data) => {
    try {
      const isMultipart = data instanceof FormData;
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/${id}`,
        data,
        { headers: getHeaders(isMultipart) }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/products/${id}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk update products
  bulkUpdate: async (updates) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/bulk/update`,
        { updates },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================
// ORDER API
// ============================================

export const adminOrderAPI = {
  // Get all orders
  getAll: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await axios.get(
        `${API_BASE_URL}/admin/orders?${params}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single order
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${id}/status`,
        { status },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${id}/payment-status`,
        { paymentStatus },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add tracking number
  addTracking: async (id, trackingNumber) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${id}/tracking`,
        { trackingNumber },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order statistics
  getStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/orders/stats/summary`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

const adminAPIs = { adminProductAPI, adminOrderAPI };

export default adminAPIs;
