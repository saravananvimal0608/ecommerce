'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBoxOpen, FaThLarge, FaUsers, FaShoppingBag, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { apiRequest } from '../../utils/commonApi';
import DashboardChart from '../../components/DashboardChart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ title, count, icon, gradient, change, link }) => (
  <Link href={link}>
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{count}</h3>
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  </Link>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5">
    <div className="mb-1">
      <h3 className="text-white font-semibold text-base">{title}</h3>
      {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default function Dashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0, users: 0, orders: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, c, u, o] = await Promise.allSettled([
          apiRequest('/api/product/allProductCount'),
          apiRequest('/api/category/allCategoryCount'),
          apiRequest('/api/user/allUserCount'),
          apiRequest('/api/order/allOrderCount'),
        ]);
        setCounts({
          products: p.value?.data || 0,
          categories: c.value?.data || 0,
          users: u.value?.data || 0,
          orders: o.value?.data || 0,
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { title: 'Total Products', count: counts.products, icon: <FaBoxOpen size={22} />, gradient: 'from-blue-500 to-cyan-500', change: 12, link: '/viewProduct' },
    { title: 'Categories', count: counts.categories, icon: <FaThLarge size={22} />, gradient: 'from-emerald-500 to-teal-500', change: 5, link: '/viewCategory' },
    { title: 'Users', count: counts.users, icon: <FaUsers size={22} />, gradient: 'from-violet-500 to-purple-600', change: 18, link: '/users' },
    { title: 'Orders', count: counts.orders, icon: <FaShoppingBag size={22} />, gradient: 'from-orange-500 to-rose-500', change: -3, link: '/orders' },
  ];

  // Chart configs
  const revenueChart = {
    chartType: 'area',
    showLegend: true,
    multipleSeries: [
      { name: 'Revenue', data: [3200, 4100, 3800, 5200, 4700, 6100, 5800, 7200, 6500, 8100, 7600, 9200] },
      { name: 'Expenses', data: [1800, 2200, 2000, 2800, 2500, 3100, 2900, 3600, 3200, 4000, 3700, 4500] },
    ],
    categories: months,
    colors: ['#8B5CF6', '#3B82F6'],
    height: 280,
  };

  const ordersChart = {
    chartType: 'bar',
    seriesName: 'Orders',
    data: [45, 62, 38, 71, 55, 83, 67, 91, 74, 88, 79, 105],
    categories: months,
    colors: ['#10B981'],
    height: 200,
  };

  const categoryChart = {
    chartType: 'donut',
    data: [counts.products || 40, counts.orders || 30, counts.users || 20, counts.categories || 10],
    labels: ['Products', 'Orders', 'Users', 'Categories'],
    colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
    height: 260,
  };

  const conversionChart = {
    chartType: 'radialBar',
    radialData: [76],
    labels: ['Conversion'],
    colors: ['#8B5CF6'],
    height: 260,
  };

  const weeklyChart = {
    chartType: 'bar',
    seriesName: 'Sales',
    data: [counts.products, counts.categories, counts.users, counts.orders],
    categories: ['Products', 'Categories', 'Users', 'Orders'],
    colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
    distributed: true,
    height: 220,
  };

  return (
    <div className="min-h-screen bg-[#060f1e] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <div className="text-xs text-slate-500 bg-[#0f172a] border border-[#1e293b] px-4 py-2 rounded-xl self-start sm:self-auto">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="mb-6">
        <ChartCard title="Revenue vs Expenses" subtitle="Monthly comparison for the current year">
          <DashboardChart chartData={revenueChart} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Orders" subtitle="Order volume across 12 months">
            <DashboardChart chartData={ordersChart} />
          </ChartCard>
        </div>
        <ChartCard title="Data Breakdown" subtitle="Distribution across modules">
          <DashboardChart chartData={categoryChart} />
        </ChartCard>
      </div>
    </div>
  );
}
