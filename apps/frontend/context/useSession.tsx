"use client";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

export interface Session {
  userId: string;
  userName: string;
  email: string;
  role: string;
  profile: string | null;
}

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);

    try {
      const res = await authFetch(`${BACKEND_URL}/auth/session`);
      if (!res.ok) {
        setSession(null);
        return;
      }
      setSession(await res.json());
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log("useSession hook");
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, setSession, isLoading, refreshSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
