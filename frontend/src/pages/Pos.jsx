import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Plus, Minus, Trash2, ShoppingCart, Search, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const Pos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes, tableRes] = await Promise.all([
          axios.get('/menu'),
          axios.get('/menu/categories'),
          axios.get('/tables')
        ]);
        // Filter only available items
        setMenuItems(menuRes.data.filter(item => item.is_available));
        setCategories(catRes.data);
        // Filter only available tables
        setTables(tableRes.data.filter(t => t.status === 'AVAILABLE'));
      } catch (error) {
        toast.error('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category_name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1, instructions: '' }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateInstructions = (id, inst) => {
    setCart(cart.map(c => c.id === id ? { ...c, instructions: inst } : c));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    if (!selectedTable) return toast.error('Please select a table');
    
    setPlacingOrder(true);
    try {
      const orderData = {
        table_id: selectedTable,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          special_instructions: item.instructions
        }))
      };
      
      await axios.post('/orders', orderData);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col min-h-0 glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex gap-4 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'All' ? 'bg-amber-500 text-zinc-950' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.name ? 'bg-amber-500 text-zinc-950' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-b border-white/5 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search for food..." 
            className="input-field pl-10 bg-black/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} onAdd={addToCart} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500">No items found</div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col min-h-0 glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-amber-500/10 flex items-center gap-3">
          <ShoppingCart className="text-amber-500" />
          <h2 className="text-lg font-bold text-amber-500">Current Order</h2>
        </div>

        <div className="p-4 border-b border-white/5 space-y-3 bg-zinc-900/50">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Select Table *</label>
            <select 
              className="input-field py-2 text-sm"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">-- Choose a table --</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>Table {t.table_number.replace('T-', '')} (Cap: {t.capacity})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input type="text" placeholder="Customer Name" className="input-field py-2 text-sm" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div className="flex-1">
              <input type="text" placeholder="Phone (Optional)" className="input-field py-2 text-sm" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white text-sm">{item.name}</h5>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-500 font-semibold text-sm">${item.price}</span>
                    <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-white/10">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded">
                        <Minus size={14} className="text-zinc-400" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded">
                        <Plus size={14} className="text-zinc-400" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Special instructions..." 
                    className="w-full bg-zinc-900 border border-white/5 rounded px-2 py-1 text-xs text-zinc-300 focus:border-amber-500/30 focus:outline-none"
                    value={item.instructions}
                    onChange={(e) => updateInstructions(item.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <Utensils size={48} className="opacity-20" />
              <p className="text-sm">Cart is empty</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-zinc-900/80">
          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="font-semibold text-zinc-300">Total</span>
            <span className="font-bold text-amber-500">${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={placeOrder}
            disabled={placingOrder || cart.length === 0}
            className={`btn-primary py-3 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pos;
