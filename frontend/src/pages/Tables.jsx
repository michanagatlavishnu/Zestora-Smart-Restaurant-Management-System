import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Tables = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState(false);
  const { socket } = useSocket();

  const canEdit = ['ADMIN', 'MANAGER'].includes(user?.role);

  const fetchTables = async () => {
    try {
      const res = await axios.get('/tables');
      setTables(res.data);
    } catch (error) {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();

    if (socket) {
      socket.on('table_status_update', () => fetchTables());
    }

    return () => {
      if (socket) {
        socket.off('table_status_update');
      }
    };
  }, [socket]);

  const updateStatus = async (id, status, tableNumber) => {
    setProcessingStatus(true);
    try {
      await axios.put(`/tables/${id}/status`, { status });
      toast.success(`Table ${tableNumber || id} updated successfully`);
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update table');
    } finally {
      setProcessingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 ring-emerald-500/50';
      case 'OCCUPIED': return 'bg-rose-500/10 text-rose-500 border-rose-500/30 ring-rose-500/50';
      case 'RESERVED': return 'bg-blue-500/10 text-blue-500 border-blue-500/30 ring-blue-500/50';
      case 'CLEANING': return 'bg-amber-500/10 text-amber-500 border-amber-500/30 ring-amber-500/50';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30 ring-zinc-500/50';
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Table Management</h1>
          <p className="text-zinc-400 text-sm">Monitor and manage restaurant tables</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 text-xs font-medium bg-zinc-900 p-2 rounded-xl border border-white/5 hidden lg:flex">
            <span className="flex items-center gap-1.5 px-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1.5 px-2 border-l border-white/10"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied</span>
            <span className="flex items-center gap-1.5 px-2 border-l border-white/10"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Reserved</span>
            <span className="flex items-center gap-1.5 px-2 border-l border-white/10"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning</span>
          </div>
          
          {canEdit && (
            <button className="btn-primary w-auto flex items-center gap-2">
              <Plus size={18} /> Add Table
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-black/40 rounded-2xl border border-white/5 p-8 relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 auto-rows-max relative z-10">
          <AnimatePresence>
            {tables.map(table => {
              // Simulate different table shapes/sizes based on capacity
              const isLarge = table.capacity >= 6;
              const isRound = table.capacity === 2 || table.capacity === 4;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={table.id}
                  className={`glass ${isRound ? 'rounded-full aspect-square' : 'rounded-2xl aspect-video'} ${isLarge ? 'col-span-2' : ''} p-4 border-4 transition-all flex flex-col items-center justify-center relative group cursor-pointer shadow-2xl ${getStatusColor(table.status)}`}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1 relative z-10">{table.table_number.replace('T-', '')}</h2>
                  <div className="flex items-center gap-1.5 text-xs opacity-80 relative z-10">
                    <Users size={12} /> {table.capacity} Seats
                  </div>
                  
                  {table.status === 'OCCUPIED' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  )}

                  {/* Hover Actions */}
                  <div className={`absolute inset-0 bg-zinc-950/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20 ${isRound ? 'rounded-full' : 'rounded-xl'}`}>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Update Status</p>
                    <div className="flex flex-wrap justify-center gap-1 w-full px-2">
                      <button disabled={processingStatus} onClick={() => updateStatus(table.id, 'AVAILABLE', table.table_number)} className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50">Free</button>
                      <button disabled={processingStatus} onClick={() => updateStatus(table.id, 'OCCUPIED', table.table_number)} className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-1 rounded hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50">Occupy</button>
                      <button disabled={processingStatus} onClick={() => updateStatus(table.id, 'CLEANING', table.table_number)} className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded hover:bg-amber-500 hover:text-white transition-colors disabled:opacity-50">Clean</button>
                      <button disabled={processingStatus} onClick={() => updateStatus(table.id, 'RESERVED', table.table_number)} className="text-[10px] bg-blue-500/20 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50">Reserve</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Tables;
