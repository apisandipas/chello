import { createContext } from "react";
import type { User } from "~/types";

export type Session = {
  isAuthenticated: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  user: User | null
  token: string | null
}

export const SessionContext = createContext<Session>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  user: null,
  token: null
});

