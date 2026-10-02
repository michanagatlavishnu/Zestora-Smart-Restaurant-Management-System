import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
        auth: { token: localStorage.getItem('token') },
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('notification', (data) => {
        toast(data.message, {
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#18181B',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
