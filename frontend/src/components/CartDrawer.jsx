import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoodImage } from '../utils/foodImages';

  const CartDrawer = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      axios.get('/tables').then(res => {
        setTables(res.data.filter(t => t.status === 'AVAILABLE'));
      }).catch(err => {
        toast.error('Failed to load tables');
      });
    }
  }, [isOpen]);

  const updateQuantity = (index, delta) => {
    const newCart = [...cartItems];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCartItems(newCart);
  };

  const updateInstructions = (index, text) => {
    const newCart = [...cartItems];
    newCart[index].special_instructions = text;
    setCartItems(newCart);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.05;
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + gst + serviceCharge;

  const handleConfirmOrder = async () => {
    if (!selectedTable) return toast.error('Please select a table');
    // Name, Phone, and Email are optional to allow true anonymous Guest orders
    
    setLoading(true);
    try {
      const payload = {
        table_id: selectedTable,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: item.special_instructions || ''
        }))
      };

      await axios.post('/orders', payload);
      toast.success('Order placed successfully!');
      setCartItems([]);
      onClose();
      navigate('/my-orders');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-950 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <ShoppingCart className="text-amber-500" /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-4">
                      <img 
                        src={getFoodImage(item.name) || 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg bg-zinc-900"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100/18181B/F59E0B?text=No+Image'; }}
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                            <span className="font-bold text-amber-500">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Special instructions..." 
                            value={item.special_instructions || ''}
                            onChange={(e) => updateInstructions(idx, e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white mt-1 focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-black/40 rounded-lg border border-white/5">
                            <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:text-amber-500 text-zinc-400">
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:text-amber-500 text-zinc-400">
                              <Plus size={16} />
                            </button>
                          </div>
                          <button onClick={() => updateQuantity(idx, -item.quantity)} className="text-xs text-red-400 hover:text-red-300">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="font-semibold text-white">Order Details</h3>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Select Table *</label>
                    <select 
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Choose a table --</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.id}>Table {t.table_number}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Name (Optional)</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Phone (Optional)</label>
                        <input 
                          type="tel" 
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                          placeholder="Your Phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Email (Optional)</label>
                        <input 
                          type="email" 
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                          placeholder="Your Email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-zinc-900/80">
                <div className="space-y-2 mb-4 text-sm text-zinc-400">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Service Charge (10%)</span><span>₹{serviceCharge.toFixed(2)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-white font-bold text-lg">
                    <span>Total</span><span className="text-amber-500">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="animate-spin" /> Placing Order...</> : 'Confirm Order'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
