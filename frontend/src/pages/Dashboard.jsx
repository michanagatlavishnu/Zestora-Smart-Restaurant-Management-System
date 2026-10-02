import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, Users, Utensils } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-zinc-400 font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-500`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    availableTables: 0,
    occupiedTables: 0,
    salesData: [],
    ordersData: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchStats = async () => {
    try {
      const res = await axios.get('/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (socket) {
      socket.on('dashboard_update', () => {
        fetchStats();
      });
      
      socket.on('new_order', () => fetchStats());
      socket.on('order_status_update', () => fetchStats());
      socket.on('table_status_update', () => fetchStats());
    }

    return () => {
      if (socket) {
        socket.off('dashboard_update');
        socket.off('new_order');
        socket.off('order_status_update');
        socket.off('table_status_update');
      }
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Today's Sales" value={`₹${stats.todaySales}`} icon={IndianRupee} color="amber" delay={0.1} />
        <StatCard title="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} color="blue" delay={0.2} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="orange" delay={0.3} />
        <StatCard title="Completed" value={stats.completedOrders} icon={CheckCircle} color="green" delay={0.4} />
        <StatCard title="Available Tables" value={stats.availableTables} icon={Utensils} color="emerald" delay={0.5} />
        <StatCard title="Occupied Tables" value={stats.occupiedTables} icon={Users} color="rose" delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-6 rounded-2xl border-white/5"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Sales Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F59E0B' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass p-6 rounded-2xl border-white/5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <button className="text-amber-500 text-sm hover:text-amber-400">View All</button>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 text-sm border-b border-white/5">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Table</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-medium text-white">{order.order_number}</td>
                      <td className="py-3 text-zinc-300">Table {order.table_id}</td>
                      <td className="py-3 text-zinc-300">₹{order.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-zinc-800 ${
                          order.status === 'COMPLETED' ? 'text-green-500' :
                          order.status === 'PREPARING' ? 'text-blue-500' :
                          order.status === 'NEW' ? 'text-orange-500' : 'text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-zinc-500">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
