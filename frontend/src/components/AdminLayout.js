import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-orange-600">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600">
            You need admin privileges to access this area.
          </p>
          <Link to="/" className="text-orange-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-800"
          >
            ☰
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink
            to="/admin/dashboard"
            label="Dashboard"
            icon="📊"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/products"
            label="Products"
            icon="📦"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/orders"
            label="Orders"
            icon="🛒"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/users"
            label="Users"
            icon="👥"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/discounts"
            label="Discounts"
            icon="💰"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/payments"
            label="Payments"
            icon="💳"
            open={sidebarOpen}
          />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && (
            <div className="mb-4">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white transition duration-200 bg-orange-600 rounded hover:bg-orange-700"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, icon, open }) {
  const isActive =
    window.location.pathname === to ||
    window.location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
        isActive
          ? 'bg-orange-600 text-white'
          : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {open && <span className="text-sm">{label}</span>}
    </Link>
  );
}
