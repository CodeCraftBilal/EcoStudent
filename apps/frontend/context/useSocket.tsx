"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "./useSession";

const SocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const { session, isLoading } = useSession();

  useEffect(() => {
    console.log("Initializing socket...");
    if (!isLoading && !session && !socketRef.current) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || "", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [ session, isLoading ]);

  return (
    <SocketContext.Provider value={socketRef.current}>
        {children}
    </SocketContext.Provider>
  )
};
