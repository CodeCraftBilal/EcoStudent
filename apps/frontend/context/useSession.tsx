"use client";
import { TimerOff } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

type Session = {
  userId: string;
  userName: string;
  email: string;
  role: string;
  profile: string;
};

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchSession = async () => {
      try {
        // Todo: fetch the session from backend
        // const response = fetch('/auth/session');
        await new Promise((resolve, reject) => {
          timeout = setTimeout(() => {
            
            setSession({
              userId: "123456789",
              userName: "Bilal Khan",
              email: "bilal.khan@example.com",
              role: "student",
              profile: '/globe.svg'
            });
            resolve(1);
          }, 5000);
        });
      } catch (error) {
        console.log('Error in Fetching the Session ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
    return () => {
        if(timeout) clearTimeout(timeout);
    };
  }, []);

  const value: SessionContextType = {
    session,
    setSession,
    isLoading,
  };
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionProvider;

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
