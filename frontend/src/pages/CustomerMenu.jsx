import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Utensils, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import CartDrawer from '../components/CartDrawer';
import { useAuth } from '../context/AuthContext';

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    // Fetch menu items and categories
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          axios.get('/menu'),
          axios.get('/menu/categories')
        ]);
        setMenuItems(menuRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (item) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category_id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  })
    .sort((a, b) => {
      if (a.category_id !== b.category_id) return (a.category_id || 0) - (b.category_id || 0);
      return Number(a.price || 0) - Number(b.price || 0);
    });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
            <Link to="/order" className="text-amber-500 transition-colors">Menu</Link>
            <Link to="/my-orders" className="hover:text-amber-500 transition-colors">My Orders</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-zinc-950 rounded-full text-xs font-bold flex items-center justify-center translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>
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

      {/* HERO SECTION */}
      <div className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 z-0" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Explore Our Menu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Fresh flavors, made for every craving. Discover our carefully curated selection of culinary delights.
          </motion.p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="container mx-auto px-6 py-8 sticky top-[73px] z-30 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex overflow-x-auto custom-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'All' 
                  ? 'bg-amber-500 text-zinc-950' 
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-amber-500 text-zinc-950' 
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* MENU GRID */}
      <div className="container mx-auto px-6 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Utensils size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} onAdd={handleAddToCart} />
            ))}
          </motion.div>
        )}
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
      />
    </div>
  );
};

export default CustomerMenu;
