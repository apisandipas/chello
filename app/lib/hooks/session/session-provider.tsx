import { useState } from "react";
import { sleep } from "~/lib/utils";
import type { User } from "~/types";
import { SessionContext } from "./session-context";


const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(getStoredToken());
    const [user, setUser] = useState<User | null>(getStoredUser());
    const isAuthenticated = !!token && !!user;

    const login = async (token: string, user: User) => {
        await sleep(250);
        setToken(token);
        setUser(user);
        setStoredToken(token);
        setStoredUser(user);
    }

    const logout = async () => {
        await sleep(250);
        setToken(null);
        setUser(null);
        setStoredToken(null);
        setStoredUser(null);
    }

    return (
        <SessionContext.Provider 
            value={{
                user,
                token,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}