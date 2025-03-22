import { useState } from "react";
import { Session, SessionContext } from "./session-context";
import { sleep } from "~/lib/utils";

const key = 'tanstack.auth.user'

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
} 

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(getStoredUser());
    const isAuthenticated = !!user

    const login = async (username: string) => {
      await sleep(250)
        setUser(username);
        setStoredUser(username);
    }

    const logout = async () => {
        await sleep(250)
        setUser(null);
        setStoredUser(null);
    }
    return <SessionContext.Provider value={{user, isAuthenticated, login, logout}}>{children}</SessionContext.Provider>
}