"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "./useSession";
import { BACKEND_URL } from "../lib/constants";

type AuthFetchFn = (
  url: string,
  options?: RequestInit
) => Promise<Response>;

export const AuthContext = createContext<AuthFetchFn | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSession } = useSession();

  const authFetch: AuthFetchFn = async (url, options = {}) => {
    const finalOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
      },
    };

    let response = await fetch(url, finalOptions);

    if (response.status !== 401) {
      return response;
    }

    // refresh token
    const refreshRes = await fetch(
      `${BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!refreshRes.ok) {
      setSession(null);
      return new Response(
        JSON.stringify({
          error: true,
          success: false,
          message: "Session expired. Please login again.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // retry original request
    return fetch(url, finalOptions);
  };

  return (
    <AuthContext.Provider value={authFetch}>
      {children}
    </AuthContext.Provider>
  );
};
