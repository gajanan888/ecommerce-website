import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    couponCode: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    perUserLimit: '1',
    applicableCategories: '',
    isActive: true,
  });

  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (activeFilter !== 'all') params.append('isActive', activeFilter);

      const response = await api.get(`/admin/discounts?${params}`);
      setDiscounts(response.data.discounts);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    fetchDiscounts();
  }, [page, activeFilter, fetchDiscounts]);

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      couponCode: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      perUserLimit: '1',
      applicableCategories: '',
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      description: discount.description,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      couponCode: discount.couponCode || '',
      minPurchaseAmount: discount.minPurchaseAmount,
      maxDiscountAmount: discount.maxDiscountAmount || '',
      startDate: new Date(discount.startDate).toISOString().split('T')[0],
      endDate: new Date(discount.endDate).toISOString().split('T')[0],
      usageLimit: discount.usageLimit || '',
      perUserLimit: discount.perUserLimit,
      applicableCategories: (discount.applicableCategories || []).join(', '),
      isActive: discount.isActive,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: parseFloat(formData.minPurchaseAmount) || 0,
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: parseInt(formData.perUserLimit),
        applicableCategories: formData.applicableCategories
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c),
      };

      if (editingDiscount) {
        await api.put(`/admin/discounts/${editingDiscount._id}`, submitData);
      } else {
        await api.post('/admin/discounts', submitData);
      }
      fetchDiscounts();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save discount');
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await api.delete(`/admin/discounts/${id}`);
        fetchDiscounts();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete discount');
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/admin/discounts/${id}/toggle-active`);
      fetchDiscounts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update discount');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading && page === 1)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading discounts...</p>
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Discounts & Offers
          </h1>
          <button
            onClick={handleAddDiscount}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            + Create Discount
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="all">All Discounts</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full p-8 my-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Discount Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  rows="3"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Type
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      placeholder="e.g., 20 or 50"
                      value={formData.discountValue}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="couponCode"
                    placeholder="Coupon Code (optional)"
                    value={formData.couponCode}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <input
                    type="number"
                    name="minPurchaseAmount"
                    placeholder="Min Purchase Amount"
                    value={formData.minPurchaseAmount}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    placeholder="Max Discount Amount (optional)"
                    value={formData.maxDiscountAmount}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <input
                    type="number"
                    name="usageLimit"
                    placeholder="Usage Limit (optional)"
                    value={formData.usageLimit}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="perUserLimit"
                    placeholder="Per User Limit"
                    value={formData.perUserLimit}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="applicableCategories"
                    placeholder="Categories (comma-separated)"
                    value={formData.applicableCategories}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-semibold">Active</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    {editingDiscount ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discounts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {discounts.map((discount) => (
                <tr key={discount._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {discount.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {discount.couponCode || '—'}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(discount.startDate).toLocaleDateString()} -{' '}
                    {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {discount.usageLimit
                      ? `${discount.usageCount} / ${discount.usageLimit}`
                      : `${discount.usageCount} / ∞`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${discount.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEditDiscount(discount)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleActive(discount._id, discount.isActive)
                      }
                      className="text-yellow-600 hover:underline"
                    >
                      {discount.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
      </div>
    </AdminLayout>
  );
}
