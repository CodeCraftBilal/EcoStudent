"use client";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

type Session = {
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
      try {
        const session = await authFetch(`${BACKEND_URL}/auth/session`);
        setSession(session);
      } catch (error) {
        console.log('Error in Fetching the Session ', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
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
