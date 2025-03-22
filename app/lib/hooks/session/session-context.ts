import { createContext } from "react";

export type Session = {
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => Promise<void>
  user: string | null
}

export const SessionContext = createContext<Session | null>(null);

