import type { User } from '@prisma/client';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from './auth.validators';
import {
  signupHandler,
  loginHandler,
  fetchSessionUserHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
} from './auth.handlers';

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface AuthResponse {
  user: Omit<User, 'password'> | null;
  token: string | null;
  error: string | null;
}

export interface PasswordResetResponse {
  success: boolean;
  error: string | null;
}

export const signup = createServerFn({
  method: 'POST',
})
  .validator(signupValidator)
  .handler(signupHandler);

export const login = createServerFn({
  method: 'POST',
})
  .validator(loginValidator)
  .handler(loginHandler);

export const fetchSessionUser = createServerFn()
  .handler(fetchSessionUserHandler);

export const getCurrentUser = createServerFn()
  .handler(getCurrentUserHandler);

export const resetPassword = createServerFn({
  method: 'POST',
})
  .validator(resetPasswordValidator)
  .handler(resetPasswordHandler); 