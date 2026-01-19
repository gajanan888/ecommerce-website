import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function AdminPaymentsPage() {
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/admin/payments/stats?${params}`);
      setPaymentStats(response.data.paymentStats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load payment stats');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchPaymentStats();
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading payment data...</p>
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Track Payments</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {/* Date Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold mb-4">Filter by Date Range</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <button
              onClick={handleFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Apply Filter
            </button>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Payment Overview */}
        {paymentStats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Completed Payments"
                value={paymentStats.totalCompleted}
                icon="✅"
                color="bg-green-500"
              />
              <StatCard
                title="Failed Payments"
                value={paymentStats.totalFailed}
                icon="❌"
                color="bg-red-500"
              />
              <StatCard
                title="Refunded Payments"
                value={paymentStats.totalRefunded}
                icon="💸"
                color="bg-orange-500"
              />
              <StatCard
                title="Success Rate"
                value={
                  paymentStats.totalCompleted === 0
                    ? 'N/A'
                    : `${(
                        (paymentStats.totalCompleted /
                          (paymentStats.totalCompleted +
                            paymentStats.totalFailed)) *
                        100
                      ).toFixed(1)}%`
                }
                icon="📊"
                color="bg-blue-500"
              />
            </div>

            {/* Payment Methods Breakdown */}
            {paymentStats.byMethod && paymentStats.byMethod.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Payment Methods Breakdown
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Transactions
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paymentStats.byMethod.map((method) => {
                        const totalCount = paymentStats.byMethod.reduce(
                          (sum, m) => sum + m.count,
                          0
                        );
                        const totalAmount = paymentStats.byMethod.reduce(
                          (sum, m) => sum + m.total,
                          0
                        );
                        const percentage =
                          totalAmount > 0
                            ? ((method.total / totalAmount) * 100).toFixed(1)
                            : 0;

                        return (
                          <tr key={method._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                              {method._id.charAt(0).toUpperCase() +
                                method._id.slice(1)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {method.count}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                              ${method.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span>{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Payment Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                  label="Total Completed Amount"
                  value={`$${paymentStats.byMethod
                    .reduce((sum, m) => sum + m.total, 0)
                    .toFixed(2)}`}
                  className="bg-green-50"
                />
                <SummaryCard
                  label="Average Transaction"
                  value={
                    paymentStats.totalCompleted > 0
                      ? `$${(
                          paymentStats.byMethod.reduce(
                            (sum, m) => sum + m.total,
                            0
                          ) / paymentStats.totalCompleted
                        ).toFixed(2)}`
                      : 'N/A'
                  }
                  className="bg-blue-50"
                />
                <SummaryCard
                  label="Total Transactions"
                  value={paymentStats.totalCompleted + paymentStats.totalFailed}
                  className="bg-purple-50"
                />
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Additional Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  label="Completion Rate"
                  value={
                    paymentStats.totalCompleted === 0
                      ? '0%'
                      : `${(
                          (paymentStats.totalCompleted /
                            (paymentStats.totalCompleted +
                              paymentStats.totalFailed)) *
                          100
                        ).toFixed(1)}%`
                  }
                />
                <MetricCard
                  label="Failed Rate"
                  value={
                    paymentStats.totalFailed === 0
                      ? '0%'
                      : `${(
                          (paymentStats.totalFailed /
                            (paymentStats.totalCompleted +
                              paymentStats.totalFailed)) *
                          100
                        ).toFixed(1)}%`
                  }
                />
                <MetricCard
                  label="Refunds Count"
                  value={paymentStats.totalRefunded}
                />
                <MetricCard
                  label="System Health"
                  value={
                    paymentStats.totalCompleted === 0
                      ? 'N/A'
                      : `${(
                          (paymentStats.totalCompleted /
                            (paymentStats.totalCompleted +
                              paymentStats.totalFailed)) *
                          100
                        ).toFixed(0)}%`
                  }
                />
              </div>
            </div>
          </>
        )}
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

function SummaryCard({ label, value, className }) {
  return (
    <div className={`${className} p-4 rounded-lg`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
