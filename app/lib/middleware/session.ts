import { createMiddleware } from '@tanstack/react-start'
import { getStoredToken } from '../hooks/session/session-provider'

export const authMiddleware = createMiddleware().client(async ({ next }) => {
  const token = getStoredToken();
  
  if (!token) {
    return next();
  }

  return next({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
})