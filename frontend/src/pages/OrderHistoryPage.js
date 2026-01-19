import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  FiPackage,
  FiEye,
  FiDownload,
  FiTruck,
  FiCheckCircle,
} from 'react-icons/fi';

const OrderHistoryPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to create your
            first order!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Order History
          </h1>
          <p className="text-gray-600">Total orders: {orders.length}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            'all',
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {status === 'all'
                ? orders.length
                : orders.filter((o) => o.status === status).length}
              )
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-2xl">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Products Preview */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.products?.slice(0, 3).map((product, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {product.name}
                      </span>
                    ))}
                    {order.products?.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        +{order.products.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Amount */}
                <div className="flex flex-col sm:flex-col sm:items-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {selectedOrder === order._id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Order Items */}
                  <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-3 mb-6">
                    {order.products?.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {product.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Details */}
                  <div className="mb-6 pb-6 border-b border-gray-200 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${order.discount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax:</span>
                      <span>${order.tax?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.shippingAddress && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Shipping Address
                      </h4>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium inline-flex items-center justify-center gap-2">
                      <FiDownload size={16} />
                      Download Invoice
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium inline-flex items-center justify-center gap-2">
                        <FiCheckCircle size={16} />
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Expand/Collapse Button */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                <button
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order._id ? null : order._id
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <FiEye size={16} />
                  {selectedOrder === order._id
                    ? 'Hide Details'
                    : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-lg">
              No {filterStatus !== 'all' ? filterStatus : ''} orders found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
