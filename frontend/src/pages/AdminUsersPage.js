import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, activeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (roleFilter) params.append('role', roleFilter);
      params.append('isActive', activeFilter);

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status');
    }
  };

  if (loading && page === 1)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex gap-4">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="all">All Users</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-4 py-2 rounded"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>

        {/* User Management Modal */}
        {selectedUser && (
          <UserManagementModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onRoleUpdate={handleRoleUpdate}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function UserManagementModal({ user, onClose, onRoleUpdate, onToggleActive }) {
  const [userStats, setUserStats] = React.useState(null);
  const [loadingStats, setLoadingStats] = React.useState(true);

  React.useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/admin/users/${user._id}`);
      setUserStats(response.data.user);
    } catch (err) {
      console.error('Failed to load user stats');
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* User Basic Info */}
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-lg">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User Stats */}
        {!loadingStats && userStats && (
          <div className="border-t pt-4 mb-6">
            <h3 className="font-bold mb-3">User Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="font-bold text-lg">{userStats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="font-bold text-lg">
                  ${userStats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Management Controls */}
        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              User Role
            </label>
            <select
              value={user.role}
              onChange={(e) => onRoleUpdate(user._id, e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Make user an admin to grant full platform access
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Account Status</p>
            <button
              onClick={() => onToggleActive(user._id)}
              className={`w-full py-2 rounded font-semibold transition ${
                user.isActive
                  ? 'bg-red-100 hover:bg-red-200 text-red-800'
                  : 'bg-green-100 hover:bg-green-200 text-green-800'
              }`}
            >
              {user.isActive ? 'Deactivate Account' : 'Activate Account'}
            </button>
            <p className="text-xs text-gray-600 mt-1">
              {user.isActive
                ? 'User can currently access the platform'
                : 'User is blocked from accessing the platform'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
