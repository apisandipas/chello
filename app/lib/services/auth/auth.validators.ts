"use server";
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const signupValidator = (data: unknown) => {
  const validated = signupSchema.safeParse(data);
  if (!validated.success) {
    console.error('[Signup Validator] Validation failed:', validated.error);
    throw new Error('Invalid data');
  }
  return validated.data;
};

export const loginValidator = (data: unknown) => {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid data');
  }
  return validated.data;
};

export const resetPasswordValidator = (data: unknown) => {
  const validated = resetPasswordSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid data');
  }
  return validated.data;
}; 