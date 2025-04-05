
import { useSession } from 'vinxi/http';
import type { User } from '@prisma/client';
import { env } from '../env';

export type SessionUser = {
  email: User['email'];
  id: User['id'];
  role: User['role'];
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: env.SESSION_SECRET,
  });
}    