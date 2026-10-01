import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../context/SocketContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (socket) {
      socket.on('notification', () => fetchNotifications());
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'order': return 'text-amber-500 bg-amber-500/10';
      case 'payment': return 'text-emerald-500 bg-emerald-500/10';
      case 'system': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-zinc-400 bg-zinc-800';
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
          <p className="text-zinc-400 text-sm">Stay updated with restaurant activities</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="btn-secondary w-auto flex items-center gap-2"
        >
          <CheckCheck size={18} /> Mark all as read
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/5 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar p-2">
          {notifications.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-xl border flex gap-4 transition-colors ${
                    notification.is_read 
                      ? 'border-transparent bg-white/[0.02]' 
                      : 'border-white/10 bg-white/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                    <Bell size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${notification.is_read ? 'text-zinc-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm ${notification.is_read ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 h-fit rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <Bell size={64} className="mb-4 opacity-20" />
              <p>You have no notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
