import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { adminOrderAPI } from '../services/adminAPI';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Notifications
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (paymentStatusFilter) filters.paymentStatus = paymentStatusFilter;

      const response = await adminOrderAPI.getAll(page, 10, filters);
      setOrders(response.data.orders);
      setTotalPages(response.data.pages);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to load orders';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, paymentStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <>
              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-800">
                              {order.userId?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.userId?.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          ₹{order.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <PaymentBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchOrders}
          isLoading={submitting}
          setSubmitting={setSubmitting}
          setToast={setToast}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </AdminLayout>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PaymentBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdate,
  isLoading,
  setSubmitting,
  setToast,
}) {
  const [trackingNumber, setTrackingNumber] = React.useState(
    order.trackingNumber || ''
  );
  const [newStatus, setNewStatus] = React.useState(order.status);
  const [newPaymentStatus, setNewPaymentStatus] = React.useState(
    order.paymentStatus
  );

  const handleStatusUpdate = async () => {
    try {
      setSubmitting(true);
      if (newStatus !== order.status) {
        await adminOrderAPI.updateStatus(order._id, newStatus);
        setToast({
          message: 'Order status updated successfully!',
          type: 'success',
        });
      }
      onUpdate();
      onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to update order status';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    try {
      setSubmitting(true);
      if (newPaymentStatus !== order.paymentStatus) {
        await adminOrderAPI.updatePaymentStatus(order._id, newPaymentStatus);
        setToast({
          message: 'Payment status updated successfully!',
          type: 'success',
        });
      }
      onUpdate();
      onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to update payment status';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackingUpdate = async () => {
    try {
      setSubmitting(true);
      await adminOrderAPI.addTracking(order._id, trackingNumber);
      setToast({
        message: 'Tracking number updated successfully!',
        type: 'success',
      });
      onUpdate();
      onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to update tracking number';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-800">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium text-gray-800">{order.userId?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{order.userId?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium text-gray-800">
                {order.userId?.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-medium text-gray-800">
                {order.shippingAddress
                  ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`
                  : order.userId?.address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Items</h3>
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm bg-gray-50 p-3 rounded"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.productName}
                  </p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6 pb-6 border-b border-gray-200 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ₹{order.subtotal?.toFixed(2) || '0.00'}
            </span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">
                ₹{order.tax?.toFixed(2) || '0.00'}
              </span>
            </div>
          )}
          {order.shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                ₹{order.shipping?.toFixed(2) || '0.00'}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₹{order.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {/* Status Updates */}
        <div className="space-y-4">
          {/* Order Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Status
            </label>
            <div className="flex gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={isLoading || newStatus === order.status}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="flex gap-2">
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                onClick={handlePaymentStatusUpdate}
                disabled={isLoading || newPaymentStatus === order.paymentStatus}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Tracking */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tracking Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTrackingUpdate}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
            {order.trackingNumber && (
              <p className="text-sm text-gray-600 mt-2">
                Current: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
