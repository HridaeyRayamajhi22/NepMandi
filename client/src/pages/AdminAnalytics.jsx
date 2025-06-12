import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import Axios from '../utils/axios';

const AdminAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get('/api/admin/analytics', { withCredentials: true });
        if (data?.success) setDashboard(data.data);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const salesTrend = useMemo(
    () =>
      dashboard?.salesTrend?.map(d => ({
        date: d._id,
        revenue: d.revenue,
        orders: d.orders,
      })) ?? [],
    [dashboard],
  );

  const topProducts = dashboard?.topProducts ?? [];
  const orderStatusBreakdown = dashboard?.orderStatusBreakdown ?? [];
  const avgOrderValue = dashboard?.avgOrderValue ?? 0;

  const C = {
    bg: 'bg-sky-950',
    card: 'from-sky-800 to-sky-900',
    text: 'text-white',
    accent: 'text-sky-300',
    border: 'border-sky-700',
    grid: '#164e63',
    line1: '#22d3ee',
    line2: '#0ea5e9',
  };

  const PIE_COLORS = ['#22d3ee', '#3b82f6', '#60a5fa', '#2563eb', '#0284c7'];

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${C.bg}`}>
        <h2 className={`text-4xl font-extrabold mb-6 ${C.text}`}>Admin Analytics</h2>
        <p className={`animate-pulse ${C.accent} text-lg`}>Loading analytics…</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${C.bg}`}>
        <h2 className={`text-4xl font-extrabold mb-6 ${C.text}`}>Admin Analytics</h2>
        <p className="text-red-500 text-lg">Failed to load analytics data.</p>
      </div>
    );
  }

  const Card = ({ title, value }) => (
    <div
      className={`bg-gradient-to-br ${C.card} p-5 rounded-xl shadow-lg flex flex-col items-center
                transform transition-transform hover:scale-105`}
    >
      <span className={`text-sm ${C.accent} uppercase tracking-wide`}>{title}</span>
      <span className="text-3xl font-extrabold mt-2">{value}</span>
    </div>
  );

  const Section = ({ title, children }) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl p-6 shadow-xl mb-12 bg-gradient-to-tr from-sky-900 via-sky-800 to-sky-900"
    >
      <h3 className={`font-semibold mb-5 text-xl ${C.accent} ${C.border} border-b pb-2`}>{title}</h3>
      {children}
    </motion.section>
  );

  return (
    <div className={`min-h-screen ${C.bg} ${C.text} px-6 py-8 font-sans`}>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-4xl font-extrabold mb-10 pb-4 ${C.border} border-b`}
      >
        Admin Analytics
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
      >
        <Card title="Total Orders" value={dashboard.totalOrders.toLocaleString()} />
        <Card title="Total Users" value={dashboard.totalUsers.toLocaleString()} />
        <Card title="30-Day Revenue" value={`रु ${salesTrend.reduce((t, d) => t + d.revenue, 0).toLocaleString()}`} />
        <Card title="30-Day Orders" value={salesTrend.reduce((t, d) => t + d.orders, 0).toLocaleString()} />
        <Card title="Avg Order Value" value={`रु ${avgOrderValue.toFixed(2).toLocaleString()}`} />
      </motion.div>

      <Section title="Revenue & Orders (Last 30 Days)">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesTrend}>
            <CartesianGrid strokeDasharray="4 4" stroke={C.grid} />
            <XAxis dataKey="date" stroke={C.line1} tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: C.grid }} />
            <YAxis yAxisId="left" stroke={C.line1} tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: C.grid }} />
            <YAxis yAxisId="right" stroke={C.line2} orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: C.grid }} />
            <Tooltip contentStyle={{ background: '#0c4a6e', borderRadius: 8, border: 'none' }} />
            <Legend wrapperStyle={{ color: C.accent }} iconType="circle" verticalAlign="top" height={36} />
            <Line yAxisId="left" type="monotone" dataKey="orders" stroke={C.line1} strokeWidth={3} activeDot={{ r: 6 }} name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={C.line2} strokeWidth={3} activeDot={{ r: 6 }} name="Revenue (रु)" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {topProducts.length > 0 && (
        <Section title="Top-Selling Products">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="qty"
                nameKey="_id"
                outerRadius={110}
                label={{ fill: C.accent.replace('text-', ''), fontSize: 13, fontWeight: 'bold' }}
              >
                {topProducts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0c4a6e', borderRadius: 8, border: 'none',color: 'white' }} />
              <Legend wrapperStyle={{ color: C.accent }} iconType="circle" verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      )}

      <Section title="Order Status Breakdown">
        {orderStatusBreakdown.length === 0 ? (
          <p className={`${C.accent}`}>No order status data.</p>
        ) : (
          <ul className="space-y-2">
            {orderStatusBreakdown.map(s => (
              <li key={s._id} className="flex justify-between px-3 py-2 rounded-lg shadow hover:shadow-lg transition-colors bg-sky-800 hover:bg-sky-700">
                <span className="font-semibold capitalize">{s._id || 'Unknown'}</span>
                <span className="font-mono">{s.count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

export default AdminAnalytics;
