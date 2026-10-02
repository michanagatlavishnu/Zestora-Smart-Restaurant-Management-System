import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

import { Link, useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on('new_order', () => fetchOrders());
      socket.on('order_status_update', () => fetchOrders());
    }

    return () => {
      if (socket) {
        socket.off('new_order');
        socket.off('order_status_update');
      }
    };
  }, [socket]);

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PREPARING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'READY': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'SERVED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
          <p className="text-zinc-400 text-sm">Manage and track customer orders</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (user?.role === 'CUSTOMER') {
                navigate('/order');
              } else {
                navigate('/pos');
              }
            }}
            className="btn-primary w-auto flex items-center gap-2"
          >
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col flex-1 min-h-0">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 glass rounded-lg text-zinc-400 hover:text-white border border-white/5">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-zinc-900 z-10">
              <tr className="text-zinc-400 text-sm border-b border-white/5">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Table</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{order.order_number}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {format(new Date(order.created_at), 'MMM dd, h:mm a')}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{order.customer_name || 'Guest'}</td>
                    <td className="px-4 py-3 text-zinc-300">Table {order.table_id || 'N/A'}</td>
                    <td className="px-4 py-3 font-medium text-white">₹{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      {order.status === 'READY' && (
                        <button 
                          onClick={async () => {
                            try {
                              await axios.put(`/orders/${order.id}/status`, { status: 'SERVED' });
                              toast.success('Order marked as Served');
                            } catch (e) {
                              toast.error('Failed to update status');
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded transition-colors"
                        >
                          Mark Served
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-1.5 text-zinc-400 hover:text-amber-500 bg-zinc-800 rounded transition-colors inline-block"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Orders;
