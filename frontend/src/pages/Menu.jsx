import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFoodImage } from '../utils/foodImages';

const Menu = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canEdit = ['ADMIN', 'MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        axios.get('/menu/categories'),
        axios.get('/menu')
      ]);
      setCategories(catRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category_name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Menu Management</h1>
          <p className="text-zinc-400 text-sm">Manage your restaurant's food items and categories</p>
        </div>
        {canEdit && (
          <button disabled={isProcessing} className="btn-primary w-auto flex items-center gap-2 disabled:opacity-50">
            <Plus size={18} /> Add Item
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`text-left px-4 py-3 rounded-xl transition-all ${
              activeCategory === 'All' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'glass hover:bg-white/5 text-zinc-300'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`text-left px-4 py-3 rounded-xl transition-all ${
                activeCategory === cat.name ? 'bg-amber-500 text-zinc-950 font-semibold' : 'glass hover:bg-white/5 text-zinc-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search menu items..." 
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 glass rounded-lg text-zinc-400 hover:text-white hover:bg-white/5">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="glass rounded-xl overflow-hidden group hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/10 flex flex-col">
                  <div className="h-40 relative bg-zinc-900 overflow-hidden">
                    <img 
                      src={getFoodImage(item.name) || 'https://via.placeholder.com/400x300/18181B/F59E0B?text=Menu+Item'} 
                      alt={item.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/18181B/F59E0B?text=No+Image'; }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.is_veg !== undefined && (
                        <span className="w-6 h-6 rounded bg-white/90 shadow-sm flex items-center justify-center p-1 backdrop-blur-md">
                          <span className={`w-3 h-3 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white line-clamp-1" title={item.name}>{item.name}</h3>
                      <span className="text-amber-500 font-bold shrink-0">${item.price}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${item.is_available ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {item.is_available ? 'Available' : 'Out of Stock'}
                      </span>
                      
                      {canEdit && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button disabled={isProcessing} className="p-1.5 text-zinc-400 hover:text-amber-500 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors disabled:opacity-50">
                            <Edit2 size={14} />
                          </button>
                          <button disabled={isProcessing} className="p-1.5 text-zinc-400 hover:text-red-500 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors disabled:opacity-50">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  No menu items found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
