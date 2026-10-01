import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, User, FileText, Mail, Phone, X, Clock, Calendar, CheckCircle2, ChevronRight, Hash, Tag, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { getFoodImage } from '../utils/foodImages';

const CustomerModal = ({ customerId, onClose }) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/customers/' + customerId);
        setCustomerData(res.data);
      } catch (error) {
        toast.error('Failed to fetch customer details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [customerId, onClose]);

  if (!customerId) return null;

  const orderHistory = customerData?.orderHistory || [];
  const activeOrders = orderHistory.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status));
  const pastOrders = orderHistory.filter(o => ['COMPLETED', 'CANCELLED'].includes(o.status));

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PREPARING': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'READY': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'SERVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'COMPLETED': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const renderTimeline = (status) => {
    const steps = ['PENDING', 'PREPARING', 'READY', 'SERVED'];
    const currentIndex = steps.indexOf(status);
    
    return (
      <div className="flex items-center w-full my-4">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-amber-500 border-amber-500 text-black' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                  {isActive ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className={`text-[10px] mt-2 font-medium ${isActive ? 'text-amber-500' : 'text-zinc-500'}`}>{step}</span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-[2px] mx-2 ${idx < currentIndex ? 'bg-amber-500' : 'bg-zinc-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="text-amber-500" /> Customer Details
            </h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-zinc-400">Loading details...</div>
            ) : customerData ? (
              <div className="space-y-8">
                
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 text-amber-500 flex items-center justify-center text-3xl font-bold shrink-0 shadow-inner">
                    {customerData.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{customerData.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1"><Hash size={14}/> ID: {customerData.id}</span>
                        <span className="flex items-center gap-1"><Calendar size={14}/> Joined: {format(new Date(customerData.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-2 sm:items-end">
                      <div className="flex items-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                        <Phone size={14} className="text-amber-500"/> {customerData.phone}
                      </div>
                      {customerData.email && (
                        <div className="flex items-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                          <Mail size={14} className="text-amber-500"/> {customerData.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 my-6">
                  <div className="text-center border-r border-white/5">
                    <div className="text-zinc-500 text-xs font-semibold mb-1 uppercase tracking-wider">Total Orders</div>
                    <div className="text-2xl font-bold text-white">{customerData.calc_total_orders || customerData.total_orders || 0}</div>
                  </div>
                  <div className="text-center border-r border-white/5">
                    <div className="text-zinc-500 text-xs font-semibold mb-1 uppercase tracking-wider">Total Spent</div>
                    <div className="text-2xl font-bold text-amber-500">₹{Number(customerData.calc_total_spending || customerData.total_spending || 0).toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-500 text-xs font-semibold mb-1 uppercase tracking-wider">Last Order</div>
                    <div className="text-lg font-medium text-white">{pastOrders.length > 0 ? format(new Date(pastOrders[0].created_at || pastOrders[0].order_date || Date.now()), 'MMM dd, yyyy') : 'N/A'}</div>
                  </div>
                </div>

                {/* Active Orders */}
                {activeOrders.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Active Order
                    </h4>
                    <div className="space-y-4">
                      {activeOrders.map(order => (
                        <div key={order.id} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ChefHat size={120} />
                          </div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-amber-500 font-bold text-lg">Order #{order.order_number}</span>
                                <div className="text-zinc-400 text-sm mt-1">Table {order.table_number || 'N/A'}</div>
                              </div>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            
                            {renderTimeline(order.status)}

                            <div className="mt-6 bg-black/20 rounded-lg p-4 border border-white/5">
                              <h5 className="text-sm text-zinc-400 mb-3 font-medium">Items in Order</h5>
                              <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-lg">
                                    {getFoodImage(item.menu_item_name) ? (
                                      <img src={getFoodImage(item.menu_item_name)} alt={item.menu_item_name} className="w-12 h-12 object-cover rounded-md" />
                                    ) : (
                                      <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-zinc-600">
                                        <Tag size={20} />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="font-medium text-zinc-200">{item.menu_item_name}</div>
                                      <div className="text-xs text-zinc-500">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</div>
                                      {item.special_instructions && (
                                        <div className="text-xs text-amber-500/80 mt-1 italic">Note: {item.special_instructions}</div>
                                      )}
                                    </div>
                                    <div className="font-semibold text-white">
                                      ${(Number(item.quantity) * Number(item.price)).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order History */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock size={16} /> Order History
                  </h4>
                  {pastOrders.length > 0 ? (
                    <div className="space-y-3">
                      {pastOrders.map(order => (
                        <details key={order.id} className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors list-none">
                            <div className="flex items-center gap-4">
                              <ChevronRight size={16} className="text-zinc-500 transition-transform group-open:rotate-90" />
                              <div>
                                <div className="font-medium text-zinc-200">Order #{order.order_number}</div>
                                <div className="text-xs text-zinc-500">{format(new Date(order.created_at || order.order_date || Date.now()), 'MMM dd, yyyy h:mm a')}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-bold text-white">₹{Number(order.total_amount || 0).toFixed(2)}</div>
                                <div className="text-xs text-zinc-500">{order.items?.length || 0} items</div>
                              </div>
                              <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </summary>
                          <div className="p-4 pt-0 border-t border-white/5 bg-black/20">
                            <div className="mt-3 space-y-2">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                  {getFoodImage(item.menu_item_name) ? (
                                    <img src={getFoodImage(item.menu_item_name)} alt={item.menu_item_name} className="w-10 h-10 object-cover rounded-md opacity-80" />
                                  ) : (
                                    <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center text-zinc-600">
                                      <Tag size={16} />
                                    </div>
                                  )}
                                  <div className="flex-1 text-sm">
                                    <div className="text-zinc-300">{item.menu_item_name}</div>
                                    <div className="text-xs text-zinc-500">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</div>
                                    {item.special_instructions && (
                                      <div className="text-xs text-zinc-400 mt-0.5 italic">"{item.special_instructions}"</div>
                                    )}
                                  </div>
                                  <div className="text-sm font-medium text-zinc-300">
                                    ${(Number(item.quantity) * Number(item.price)).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Payment Info */}
                            <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-sm">
                              <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>₹{Number(order.subtotal || 0).toFixed(2)}</span></div>
                              <div className="flex justify-between text-zinc-400"><span>GST (5%)</span><span>₹{Number(order.tax || 0).toFixed(2)}</span></div>
                              <div className="flex justify-between text-zinc-400"><span>Service Charge (10%)</span><span>₹{Number(order.service_charge || 0).toFixed(2)}</span></div>
                              <div className="flex justify-between text-white font-bold text-base pt-1"><span>Total</span><span className="text-amber-500">₹{Number(order.total || order.total_amount || 0).toFixed(2)}</span></div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">Payment</div>
                                <div className="flex gap-2 items-center">
                                  <span className="text-xs text-zinc-300 bg-white/10 px-2 py-0.5 rounded uppercase">{order.payment_method || 'CARD'}</span>
                                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{order.payment_status || 'PAID'}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-500">
                      No past orders found.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center text-zinc-500">No data available</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  const { socket } = useSocket() || {};

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleUpdate = () => fetchCustomers();
      socket.on('new_order', handleUpdate);
      socket.on('order_status_update', handleUpdate);
      
      return () => {
        socket.off('new_order', handleUpdate);
        socket.off('order_status_update', handleUpdate);
      };
    }
  }, [socket]);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Customers</h1>
          <p className="text-zinc-400 text-sm">Manage customer profiles and order history</p>
        </div>
        <button className="btn-primary w-auto flex items-center gap-2">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/5 flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-zinc-900 z-10 shadow-sm shadow-black/50">
              <tr className="text-zinc-400 text-sm border-b border-white/5">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Orders</th>
                <th className="px-6 py-4 font-medium text-right">Spent</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium text-center">Current Table</th>
                <th className="px-6 py-4 font-medium text-center">Current Order</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-zinc-300 flex items-center gap-2 mb-1"><Mail size={14} className="text-zinc-500"/> {customer.email || 'N/A'}</div>
                        <div className="text-zinc-400 flex items-center gap-2"><Phone size={14} className="text-zinc-500"/> {customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-300 font-medium">
                      {customer.calc_total_orders || customer.total_orders || 0}
                    </td>
                    <td className="px-6 py-4 text-right text-amber-500 font-bold">
                      ${Number(customer.calc_total_spending || customer.total_spending || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {customer.last_order_date ? format(new Date(customer.last_order_date), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-300 font-medium">
                      {customer.active_table_number || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {customer.active_order_number ? (
                        <span className="text-amber-500 font-semibold flex items-center justify-center gap-1">
                          #{customer.active_order_number}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {customer.active_order_number ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="text-xs font-bold text-amber-500/90 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                            {customer.active_order_status || 'ACTIVE'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-zinc-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className="p-2 text-zinc-400 hover:text-amber-500 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors inline-block"
                      >
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-zinc-500">
                    <User size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No customers found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomerId && (
        <CustomerModal 
          customerId={selectedCustomerId} 
          onClose={() => setSelectedCustomerId(null)} 
        />
      )}
    </div>
  );
};

export default Customers;
