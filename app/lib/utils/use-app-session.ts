
import { useSession } from 'vinxi/http';
import type { User } from '@prisma/client';

export type SessionUser = {
  email: User['email'];
  id: User['id'];
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: process.env.SESSION_SECRET || '',
  });
}    