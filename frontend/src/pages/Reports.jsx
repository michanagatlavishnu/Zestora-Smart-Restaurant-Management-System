import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Printer, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`/reports?range=${dateRange}`);
        setReportData(res.data);
      } catch (error) {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [dateRange]);

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

  if (loading || !reportData) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1>
          <p className="text-zinc-400 text-sm">Comprehensive insights into restaurant performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="input-field py-2 w-auto bg-zinc-900"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors" title="Print Report">
            <Printer size={20} />
          </button>
          <button className="p-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors" title="Export CSV">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white">₹{reportData.totalRevenue || 0}</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-white">{reportData.totalOrders || 0}</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-zinc-400 text-sm font-medium mb-1">Avg. Order Value</p>
          <h3 className="text-3xl font-bold text-white">₹{reportData.avgOrderValue || 0}</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Customers</p>
          <h3 className="text-3xl font-bold text-white">{reportData.totalCustomers || 0}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F59E0B' }}
                />
                <Bar dataKey="amount" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            {reportData.categoryData && reportData.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-zinc-500">No category data available</p>
            )}
            {/* Custom Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {reportData.categoryData?.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
