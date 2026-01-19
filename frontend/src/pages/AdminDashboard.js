import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";

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
      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stats");
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon="📦"
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon="🛒"
            color="bg-purple-500"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon="💰"
            color="bg-yellow-500"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon="⏳"
            color="bg-orange-500"
          />
          <StatCard
            title="Delivered Orders"
            value={stats?.completedOrders || 0}
            icon="✅"
            color="bg-teal-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickActionButton
              label="Manage Products"
              to="/admin/products"
              icon="📦"
            />
            <QuickActionButton
              label="View Orders"
              to="/admin/orders"
              icon="🛒"
            />
            <QuickActionButton
              label="Manage Users"
              to="/admin/users"
              icon="👥"
            />
            <QuickActionButton
              label="Set Discounts"
              to="/admin/discounts"
              icon="💰"
            />
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem
              label="Shipped Orders"
              value={stats?.shippedOrders || 0}
            />
            <InfoItem
              label="Revenue per Order"
              value={`$${
                stats?.totalOrders > 0
                  ? (stats?.totalRevenue / stats?.totalOrders).toFixed(2)
                  : 0
              }`}
            />
            <InfoItem
              label="Conversion Rate"
              value={
                stats?.totalOrders
                  ? `${((stats?.totalOrders / stats?.totalUsers) * 100).toFixed(
                      1
                    )}%`
                  : "N/A"
              }
            />
            <InfoItem
              label="Avg Order Value"
              value={`$${
                stats?.totalOrders > 0
                  ? (stats?.totalRevenue / stats?.totalOrders).toFixed(2)
                  : 0
              }`}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`${color} text-white rounded-lg shadow p-6 flex items-center space-x-4`}
    >
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ label, to, icon }) {
  return (
    <a
      href={to}
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition duration-200 flex items-center space-x-2 text-center justify-center"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </a>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}
