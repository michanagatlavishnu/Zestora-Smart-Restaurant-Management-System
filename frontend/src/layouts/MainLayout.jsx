import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, UtensilsCrossed, ChefHat, Grid2X2, MenuSquare, 
  Users, Receipt, CreditCard, BarChart3, UserCog, Bell, Settings, 
  LogOut, Menu as MenuIcon, Search, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          // A simple mock of what a global search would return from backend
          // Since we don't have a /global-search endpoint, we can try to fetch them individually 
          // or just implement client side filtering for demo purposes.
          const [orders, customers, menu, tables] = await Promise.all([
            axios.get('/orders'),
            axios.get('/customers'),
            axios.get('/menu'),
            axios.get('/tables')
          ]);
          
          const q = searchQuery.toLowerCase();
          setSearchResults({
            orders: orders.data.filter(o => o.order_number.toLowerCase().includes(q)),
            customers: customers.data.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)),
            menu: menu.data.filter(m => m.name.toLowerCase().includes(q)),
            tables: tables.data.filter(t => t.table_number.toLowerCase().includes(q))
          });
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Orders', path: '/orders', icon: <UtensilsCrossed size={20} />, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER'] },
    { name: 'Kitchen', path: '/kitchen', icon: <ChefHat size={20} />, roles: ['ADMIN', 'MANAGER', 'KITCHEN'] },
    { name: 'Tables', path: '/tables', icon: <Grid2X2 size={20} />, roles: ['ADMIN', 'MANAGER', 'WAITER'] },
    { name: 'Menu', path: '/menu', icon: <MenuSquare size={20} />, roles: ['ADMIN', 'MANAGER', 'WAITER', 'CUSTOMER'] },
    { name: 'Customers', path: '/customers', icon: <Users size={20} />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Billing', path: '/billing', icon: <Receipt size={20} />, roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} />, roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Staff', path: '/staff', icon: <UserCog size={20} />, roles: ['ADMIN'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['ADMIN'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 256 }}
        className="h-full glass border-r border-white/5 flex flex-col shrink-0 relative z-20"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5 h-16">
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-amber-500 tracking-wider"
            >
              ZESTORA
            </motion.h1>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-auto"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                }
              `}
              title={collapsed ? item.name : ""}
            >
              <div className="shrink-0">{item.icon}</div>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <NavLink to="/profile" className={`flex items-center gap-3 mb-4 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold border border-amber-500/20 shrink-0">
              {user?.name?.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-zinc-200 truncate">{user?.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.role}</p>
              </div>
            )}
          </NavLink>
          
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex-1 max-w-md hidden md:block relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, menu, customers..." 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  <X size={16} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {searchResults && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full glass rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 max-h-96 flex flex-col"
                >
                  <div className="overflow-y-auto custom-scrollbar p-2">
                    {isSearching ? (
                      <div className="p-4 text-center text-zinc-500 text-sm">Searching...</div>
                    ) : (
                      <>
                        {searchResults.orders?.length > 0 && (
                          <div className="mb-2">
                            <h4 className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Orders</h4>
                            {searchResults.orders.slice(0, 3).map(o => (
                              <button key={o.id} onClick={() => { navigate('/orders'); setSearchResults(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex justify-between items-center text-sm">
                                <span className="text-white font-medium">{o.order_number}</span>
                                <span className="text-zinc-400 text-xs">{o.status}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.customers?.length > 0 && (
                          <div className="mb-2">
                            <h4 className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customers</h4>
                            {searchResults.customers.slice(0, 3).map(c => (
                              <button key={c.id} onClick={() => { navigate('/customers'); setSearchResults(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex flex-col text-sm">
                                <span className="text-white font-medium">{c.name}</span>
                                <span className="text-zinc-400 text-xs">{c.phone}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.menu?.length > 0 && (
                          <div className="mb-2">
                            <h4 className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu</h4>
                            {searchResults.menu.slice(0, 3).map(m => (
                              <button key={m.id} onClick={() => { navigate('/menu'); setSearchResults(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex justify-between items-center text-sm">
                                <span className="text-white font-medium">{m.name}</span>
                                <span className="text-amber-500 text-xs">${m.price}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.tables?.length > 0 && (
                          <div className="mb-2">
                            <h4 className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tables</h4>
                            {searchResults.tables.slice(0, 3).map(t => (
                              <button key={t.id} onClick={() => { navigate('/tables'); setSearchResults(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex justify-between items-center text-sm">
                                <span className="text-white font-medium">{t.table_number}</span>
                                <span className="text-zinc-400 text-xs">{t.status}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {Object.values(searchResults).every(arr => arr?.length === 0) && (
                          <div className="p-4 text-center text-zinc-500 text-sm">No results found</div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 md:hidden">
            <h2 className="text-lg font-medium truncate">Welcome, {user?.name?.split(' ')[0]}</h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={() => navigate('/notifications')} className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
