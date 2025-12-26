"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "./useSession";

const SocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading || !session) {
      return;
    }

    console.log("Initializing socket...");

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ["websocket"],
      withCredentials: true, // important for auth cookies
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [session, isLoading]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
