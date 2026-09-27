import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="bg-red-500/10 text-red-500 p-8 rounded-2xl border border-red-500/20 font-bold uppercase tracking-widest text-xs flex items-center gap-4">
          <span className="text-xl">⚠️</span> {error}
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      {/* Animated Gradient Background */}
      <div
        className="fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#18181b] opacity-90 blur-2xl"
        style={{ pointerEvents: 'none' }}
      />
      <div className="space-y-10 relative">
        {/* Professional Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <img
                src="/images/admin-avatar.png"
                alt="Admin"
                className="w-12 h-12 rounded-full border-2 border-orange-500 shadow-lg"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Admin Command Center
              </h1>
            </div>
            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
              Real-time Metrics & Controls
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-black uppercase tracking-widest">
              PRO
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-black uppercase tracking-widest">
              System Healthy
            </span>
          </div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon="💰"
            gradient="from-yellow-400 to-orange-500"
            trend="+12.5%"
          />
          <StatCard
            title="Active Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            gradient="from-blue-400 to-indigo-600"
            trend="+5.2%"
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon="🛍️"
            gradient="from-purple-400 to-pink-600"
            trend="+8.1%"
          />
          <StatCard
            title="Pending Actions"
            value={stats?.pendingOrders || 0}
            icon="⏳"
            gradient="from-orange-400 to-red-500"
            isAlert={stats?.pendingOrders > 0}
          />
        </div>

        {/* Section Divider */}
        <div className="w-full h-0.5 bg-gradient-to-r from-orange-500/0 via-white/10 to-orange-500/0 my-10 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Detailed Activity */}
          <div className="lg:col-span-2 bg-[#0A0A0A]/80 border border-white/10 rounded-[2rem] p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-orange-500/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />{' '}
                System Health
              </h2>
              <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow">
                Optimal
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <InfoItem
                label="Conversion Rate"
                value={
                  stats?.totalOrders
                    ? `${((stats?.totalOrders / stats?.totalUsers) * 100).toFixed(1)}%`
                    : '0%'
                }
                icon="🎯"
              />
              <InfoItem
                label="Avg Order Value"
                value={`₹${stats?.totalOrders > 0 ? (stats?.totalRevenue / stats?.totalOrders).toFixed(0) : 0}`}
                icon="💳"
              />
              <InfoItem
                label="Products Listed"
                value={stats?.totalProducts || 0}
                icon="📦"
              />
              <InfoItem
                label="Delivered"
                value={stats?.completedOrders || 0}
                icon="✅"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0A0A0A]/80 border border-white/10 rounded-[2rem] p-10 shadow-2xl flex flex-col justify-center gap-6 backdrop-blur-xl transition-all duration-300 hover:shadow-orange-500/10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-pulse" />{' '}
              Fast Track
            </h2>
            <QuickActionButton
              label="Add Product"
              to="/admin/products"
              icon="➕"
            />
            <QuickActionButton
              label="View Orders"
              to="/admin/orders"
              icon="👁️"
            />
            <QuickActionButton
              label="Manage Users"
              to="/admin/users"
              icon="👥"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0A0A0A]/80 border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">
              Revenue · Last 7 Days
            </h2>
            <div className="flex items-end gap-3 h-40">
              {(stats?.revenueByDay || []).map((day) => {
                const maxRevenue = Math.max(
                  ...(stats?.revenueByDay || []).map((item) => item.revenue),
                  1
                );
                return (
                  <div
                    key={day._id}
                    className="flex-1 h-full flex flex-col justify-end gap-2"
                  >
                    <div
                      className="bg-orange-500 rounded-t-lg min-h-[4px]"
                      style={{
                        height: `${Math.max((day.revenue / maxRevenue) * 100, 3)}%`,
                      }}
                      title={`₹${day.revenue}`}
                    />
                    <span className="text-[9px] text-white/40 text-center">
                      {day._id.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0A0A0A]/80 border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">
              Low Stock Alerts
            </h2>
            {stats?.lowStockProducts?.length ? (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between border-b border-white/5 pb-3"
                  >
                    <span className="text-sm text-white/80">
                      {product.name}
                    </span>
                    <span className="text-xs font-black text-orange-500 uppercase">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">
                All products have healthy stock.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, gradient, isAlert, trend }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] p-8 border border-white/5 bg-[#0A0A0A] group hover:-translate-y-1 transition-all duration-500`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-all duration-500`}
      />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest">
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-white/40 font-bold uppercase tracking-[0.15em] text-[10px] mb-2">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>

      {isAlert && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-red-600" />
      )}
    </div>
  );
}

function QuickActionButton({ label, to, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span className="font-bold text-sm text-white uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-white/20 group-hover:text-white transition-colors">
        →
      </span>
    </Link>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
      <span className="text-xl opacity-50">{icon}</span>
      <div>
        <p className="text-white font-black text-xl mb-1">{value}</p>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
          {label}
        </p>
      </div>
    </div>
  );
}
