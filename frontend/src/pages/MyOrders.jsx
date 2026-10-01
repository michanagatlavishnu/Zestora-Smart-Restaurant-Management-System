import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Utensils, Receipt, CheckCircle2, Clock, ChefHat, BellRing, User, LogOut } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const STATUS_STAGES = [
  { id: 'NEW', label: 'Order Placed', icon: Receipt },
  { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { id: 'READY', label: 'Ready', icon: BellRing },
  { id: 'COMPLETED', label: 'Served', icon: CheckCircle2 }
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const { user, logout } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      // For a real app, filter by customer_phone or user ID
      // Here we just show recent orders or filter if user is logged in as CUSTOMER
      let userOrders = res.data;
      if (user && user.role === 'CUSTOMER') {
         userOrders = res.data.filter(o => o.customer_phone === user.phone || o.customer_name === user.name);
      }
      
      // Sort by latest first
      userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on('order_status_update', (updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o));
      });
      socket.on('new_order', () => fetchOrders());
    }

    return () => {
      if (socket) {
        socket.off('order_status_update');
        socket.off('new_order');
      }
    };
  }, [socket, user]);

  const getStatusIndex = (status) => {
    if (status === 'CONFIRMED') return 0;
    const index = STATUS_STAGES.findIndex(s => s.id === status);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 font-sans pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-500 tracking-widest flex items-center gap-2">
            <Utensils size={24} /> ZESTORA
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <Link to="/order" className="hover:text-amber-500 transition-colors">Menu</Link>
            <Link to="/my-orders" className="text-amber-500 transition-colors">My Orders</Link>
          </div>

          <div className="flex items-center gap-4">
             {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
                  <User size={18} /> <span className="hidden md:inline">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-zinc-400 hover:text-red-400">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-bold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">My Orders</h1>
          <p className="text-zinc-400">Track your recent dining experiences.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-amber-500"><Clock className="animate-spin" size={40} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <Receipt size={64} className="mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-zinc-400 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/order" className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold rounded-lg hover:bg-amber-400 transition-colors">
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order, i) => {
                const currentIndex = getStatusIndex(order.status);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={order.id} 
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{order.order_number}</h3>
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">
                            Table {order.table_id}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm flex items-center gap-2">
                          <Clock size={14} /> {format(new Date(order.created_at), 'MMM dd, yyyy - hh:mm a')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-zinc-400 mb-1">Total Amount</div>
                        <div className="text-2xl font-bold text-white">₹{order.total_amount?.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative mb-10 mt-4 px-4 md:px-0">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full hidden md:block"></div>
                      
                      {/* Active line */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-700 hidden md:block"
                        style={{ width: `${(currentIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
                      ></div>

                      <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                        {STATUS_STAGES.map((stage, idx) => {
                          const isCompleted = idx <= currentIndex;
                          const isActive = idx === currentIndex;
                          const Icon = stage.icon;

                          return (
                            <div key={stage.id} className="flex md:flex-col items-center gap-4 md:gap-2 relative">
                              {/* Mobile vertical line */}
                              {idx !== STATUS_STAGES.length - 1 && (
                                <div className={`absolute left-5 top-10 w-0.5 h-full -z-10 md:hidden ${isCompleted ? 'bg-amber-500' : 'bg-white/10'}`}></div>
                              )}
                              
                              <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg
                                ${isCompleted ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 border-2 border-white/20 text-zinc-500'}
                                ${isActive ? 'ring-4 ring-amber-500/20 scale-110' : ''}
                              `}>
                                <Icon size={20} />
                              </div>
                              <div className={`font-semibold text-sm ${isActive ? 'text-amber-500' : isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                                {stage.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="bg-black/30 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-3 text-sm">Items Ordered</h4>
                      <ul className="space-y-2">
                        {order.items && order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-amber-500 font-bold mr-2">{item.quantity}x</span>
                              <span className="text-zinc-300">{item.name}</span>
                            </div>
                            <span className="text-zinc-500">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
