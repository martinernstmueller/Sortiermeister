"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type SessionData = {
  playerName: string;
  algorithm: "bubble" | "insertion";
  difficulty: number;
};

type SessionContextType = {
  session: SessionData | null;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
  isLoggedIn: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionData | null>(null);

  const setSession = (data: SessionData) => {
    setSessionState(data);
  };

  const clearSession = () => {
    setSessionState(null);
  };

  const isLoggedIn = session !== null;

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession, isLoggedIn }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
