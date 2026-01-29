import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  FiPackage,
  FiEye,
  FiDownload,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import OrderTracker from '../components/OrderTracker';

const OrderHistoryPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data || response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancelOrder(orderId);
      showSuccess('Order cancelled successfully');
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling order:', error);
      showError(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-white/5 text-white/40 border-white/5';
      case 'processing':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/5 text-white/40 border-white/5';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-white/20" />;
      case 'processing':
        return <FiPackage className="text-orange-500" />;
      case 'shipped':
        return <FiTruck className="text-blue-400" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-400" />;
      case 'cancelled':
        return <FiXCircle className="text-red-400" />;
      default:
        return <FiPackage className="text-white/20" />;
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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/5 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
            Decoding Orders...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] pt-24 px-6">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-12 border border-white/10">
            <FiPackage size={48} className="text-white/20" />
          </div>
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
            Archive Empty
          </h2>
          <p className="text-white/40 mb-12 font-bold uppercase tracking-widest text-xs leading-relaxed">
            No acquisitions recorded in your primary ledger. Start building your
            architectural wardrobe.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-white text-black py-5 px-10 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 hover:text-white transition-all duration-500"
          >
            Enter Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
            Ledger Overview
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 uppercase tracking-tighter leading-tight">
            Acquisitions
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
              {orders.length} SIGNED PROTOCOLS
            </p>
          </div>
        </div>

        {/* Filter Tabs - Premium Noir Style */}
        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 hide-scrollbar">
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
              className={`px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 border ${filterStatus === status
                ? 'bg-white text-black border-white shadow-xl shadow-white/5'
                : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="designer-card p-0 overflow-hidden">
              <div className="p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                        Protocol #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                        Acquired {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Products Preview */}
                  <div className="flex flex-wrap gap-2">
                    {(order.items || order.products)
                      ?.slice(0, 3)
                      .map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/60 px-3 py-1.5 rounded-lg border border-white/5"
                        >
                          {item.productName || item.name}
                        </span>
                      ))}
                    {(order.items || order.products)?.length > 3 && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/40 px-3 py-1.5 rounded-lg border border-white/5">
                        +{(order.items || order.products).length - 3} SPECIMENS
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Amount */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6">
                  <div className="sm:text-right">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white tracking-tighter">
                      ₹{(order.total || order.totalAmount || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {selectedOrder === order._id && (
                <div className="border-t border-white/5 p-8 bg-white/[0.02] animate-in slide-in-from-top-4 duration-500">
                  <div className="mb-12">
                    <OrderTracker
                      status={order.status}
                      createdAt={order.createdAt}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">
                        Inventory Detail
                      </h4>
                      <div className="space-y-3">
                        {(order.items || order.products)?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5"
                          >
                            <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">
                                {item.productName || item.name}
                              </p>
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                UNIT: {item.quantity}
                              </p>
                            </div>
                            <p className="font-black text-white text-xs">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">
                        Execution Detail
                      </h4>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>Subtotal</span>
                          <span className="text-white">
                            ₹{order.subtotal?.toFixed(0) || '0'}
                          </span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-500">
                            <span>Markdown</span>
                            <span>-₹{order.discount?.toFixed(0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-500">
                          <span>Logistics</span>
                          <span>Complimentary</span>
                        </div>
                        <div className="h-[1px] bg-white/10 my-4" />
                        <div className="flex justify-between text-base font-black uppercase tracking-widest text-white">
                          <span>TOTAL</span>
                          <span>₹{order.total?.toFixed(0) || '0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-12 flex-wrap">
                    <button className="flex-1 sm:flex-none px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all inline-flex items-center justify-center gap-3">
                      <FiDownload size={14} />
                      Archival Invoice
                    </button>
                    {(order.status === 'pending' ||
                      order.status === 'processing') && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex-1 sm:flex-none px-8 py-4 bg-red-500/10 text-red-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all inline-flex items-center justify-center gap-3 border border-red-500/20"
                        >
                          <FiXCircle size={14} />
                          Abort Protocol
                        </button>
                      )}
                  </div>
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() =>
                  setSelectedOrder(
                    selectedOrder === order._id ? null : order._id
                  )
                }
                className="w-full border-t border-white/5 bg-white/5 px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-3"
              >
                <FiEye size={14} />
                {selectedOrder === order._id
                  ? 'Collapse Artifact'
                  : 'Inspect Artifact'}
              </button>
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
