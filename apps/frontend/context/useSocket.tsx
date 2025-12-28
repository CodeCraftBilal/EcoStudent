// context/useSocket.tsx (update existing context)
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '@/lib/types/constants';
import { useSession } from './useSession';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  orderSocket: Socket | null;
  connectOrderSocket: () => void;
  disconnectOrderSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  orderSocket: null,
  connectOrderSocket: () => {},
  disconnectOrderSocket: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orderSocket, setOrderSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOrderConnected, setIsOrderConnected] = useState(false);
  const {session, isLoading} = useSession();
  
  useEffect(() => {

    if(!session || isLoading ) return;
    // Connect to main socket for messages
    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Main socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Main socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session, isLoading]);

  const connectOrderSocket = () => {
    if (orderSocket?.connected) return;

    // Connect to order namespace
    const newOrderSocket = io(`${BACKEND_URL}/orders`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: '/socket.io/orders',
    });

    newOrderSocket.on('connect', () => {
      console.log('Order socket connected');
      setIsOrderConnected(true);
    });

    newOrderSocket.on('disconnect', () => {
      console.log('Order socket disconnected');
      setIsOrderConnected(false);
    });

    newOrderSocket.on('connect_error', (error) => {
      console.error('Order socket connection error:', error);
    });

    setOrderSocket(newOrderSocket);
  };

  const disconnectOrderSocket = () => {
    if (orderSocket) {
      orderSocket.disconnect();
      setOrderSocket(null);
      setIsOrderConnected(false);
    }
    console.log('Order socket disconnected manually');
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      orderSocket,
      connectOrderSocket,
      disconnectOrderSocket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};