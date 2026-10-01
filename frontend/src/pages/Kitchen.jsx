import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { ChefHat, Clock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Kitchen = () => {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchKitchenOrders = async () => {
    try {
      const res = await axios.get('/orders');
      // Filter for orders that need kitchen attention
      const filtered = res.data.filter(o => ['NEW', 'CONFIRMED', 'PREPARING'].includes(o.status));
      setKitchenOrders(filtered);
    } catch (error) {
      toast.error('Failed to load kitchen orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    if (socket) {
      socket.on('new_order', () => fetchKitchenOrders());
      socket.on('order_status_update', () => fetchKitchenOrders());
    }

    return () => {
      if (socket) {
        socket.off('new_order');
        socket.off('order_status_update');
      }
    };
  }, [socket]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchKitchenOrders(); // Re-fetch immediately (Socket will also fire)
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <ChefHat className="text-amber-500" /> Kitchen Display
          </h1>
          <p className="text-zinc-400 text-sm">Real-time order tracking for kitchen staff</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-2 border border-white/5 flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> New/Confirmed
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Preparing
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar flex gap-6 pb-4">
        {/* Kanban Columns */}
        {['NEW', 'PREPARING', 'READY'].map(statusGroup => {
          const columnOrders = kitchenOrders.filter(o => {
            if (statusGroup === 'NEW') return ['NEW', 'CONFIRMED'].includes(o.status);
            return o.status === statusGroup;
          });
          
          return (
            <div key={statusGroup} className="flex-1 min-w-[320px] bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  {statusGroup === 'NEW' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                  {statusGroup === 'PREPARING' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                  {statusGroup === 'READY' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  {statusGroup === 'NEW' ? 'NEW / CONFIRMED' : statusGroup}
                </h2>
                <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full">{columnOrders.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {columnOrders.map((order) => {
                    const orderDate = new Date(order.created_at);
                    const waitTimeMins = Math.floor((new Date() - orderDate) / 60000);
                    // Visual urgency: > 15 mins is red, > 10 mins is yellow
                    const isUrgent = waitTimeMins > 15;
                    const isWarning = waitTimeMins > 10;
                    
                    return (
                      <motion.div 
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`glass rounded-xl overflow-hidden border-l-4 ${
                          isUrgent ? 'border-l-red-500 ring-1 ring-red-500/20' : 
                          isWarning ? 'border-l-amber-500' : 'border-l-zinc-700'
                        }`}
                      >
                        <div className={`p-3 border-b border-white/5 ${isUrgent ? 'bg-red-500/10' : 'bg-white/[0.02]'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-md font-bold text-white">{order.order_number}</h3>
                            <span className="bg-zinc-900 text-white px-2 py-0.5 rounded text-xs font-semibold">
                              Table {order.table_id || 'N/A'}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 text-xs font-medium ${isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-zinc-400'}`}>
                            <Clock size={12} /> 
                            {formatDistanceToNow(orderDate, { addSuffix: true })}
                          </div>
                        </div>

                        <div className="p-3 bg-zinc-950/50">
                          <ul className="space-y-2 text-sm">
                            {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between items-start border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                <div>
                                  <span className="text-amber-500 font-bold mr-2">{item.quantity}x</span>
                                  <span className="text-zinc-200">{item.name}</span>
                                  {item.special_instructions && (
                                    <p className="text-xs text-rose-400 mt-0.5 italic pl-6">{item.special_instructions}</p>
                                  )}
                                </div>
                              </li>
                            )) : (
                              <li className="text-zinc-500 italic text-xs">Items loading...</li>
                            )}
                          </ul>
                        </div>

                        <div className="p-2 bg-black/20 mt-auto">
                          {statusGroup === 'NEW' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                              className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold py-1.5 rounded transition-colors text-sm"
                            >
                              Start Preparing
                            </button>
                          )}
                          {statusGroup === 'PREPARING' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'READY')}
                              className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black font-semibold py-1.5 rounded transition-colors flex items-center justify-center gap-1 text-sm"
                            >
                              <Check size={14} /> Mark Ready
                            </button>
                          )}
                          {statusGroup === 'READY' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                              className="w-full bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-black font-semibold py-1.5 rounded transition-colors text-sm"
                            >
                              Mark Served
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {columnOrders.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-zinc-600 text-sm italic">
                    No orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kitchen;
