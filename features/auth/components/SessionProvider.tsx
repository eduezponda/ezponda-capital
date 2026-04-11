"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import type { Tier, Role } from "@/features/auth/lib/session";

export interface ClientSession {
  id: string;
  email: string;
  name?: string;
  role: Role;
  tier: Tier;
}

interface SessionContextValue {
  session: ClientSession | null;
}

const SessionContext = createContext<SessionContextValue>({ session: null });

interface Props {
  session: ClientSession | null;
  children: React.ReactNode;
}

export function SessionProvider({ session, children }: Props) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): ClientSession | null {
  return useContext(SessionContext).session;
}
