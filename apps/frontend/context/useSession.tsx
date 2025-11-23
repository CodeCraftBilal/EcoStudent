"use client";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

export interface Session {
  userId: string;
  userName: string;
  email: string;
  role: string;
  profile: string | null;
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
    const fetchSession = async () => {
      console.log('useeffect in session', isLoading)
      try {
        const res = await authFetch(`${BACKEND_URL}/auth/session`);
        if(!res.ok) {
          setSession(null)
          
          return;
        }
        const session = await res.json();
        
        setSession(session);
      } catch (error) {
        
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    console.log('session', session)
  }, [isLoading])
  
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
