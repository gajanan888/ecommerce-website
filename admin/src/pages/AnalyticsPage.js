import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setAnalyticsData([
      { date: 'Jan 1', sales: 400, visitors: 2400, conversion: 2.4 },
      { date: 'Jan 2', sales: 500, visitors: 2210, conversion: 2.5 },
      { date: 'Jan 3', sales: 300, visitors: 2290, conversion: 2.3 },
      { date: 'Jan 4', sales: 200, visitors: 2000, conversion: 2.0 },
      { date: 'Jan 5', sales: 600, visitors: 2181, conversion: 2.6 },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AnalyticCard title="Total Visitors" value="24,500" trend="+12%" />
        <AnalyticCard title="Conversion Rate" value="2.45%" trend="+0.8%" />
        <AnalyticCard title="Avg Order Value" value="$125.50" trend="+5.3%" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sales & Visitors Trend</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AnalyticCard = ({ title, value, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <p className="text-gray-600 text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    <p className="text-green-600 text-sm font-semibold mt-2">{trend}</p>
  </div>
);

export default AnalyticsPage;
