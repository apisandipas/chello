import type { User } from '@prisma/client';
import { createServerFn } from '@tanstack/react-start';
import * as argon2 from 'argon2';
import { z } from 'zod';
import prisma from '../db-client';
import { useAppSession } from '../utils/use-app-session';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

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
  .validator((data) => {
    const validated = signupSchema.safeParse(data);
    if (!validated.success) {
      console.error('[Signup Validator] Validation failed:', validated.error);
      throw new Error('Invalid data');
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      }).catch(err => {
        throw err;
      });

      if (existingUser) {
        return {
          userNotFound: false,
          error: true,
          message: 'Email already in use',
        };
      }

      // Hash password with Argon2
      const hashedPassword = await argon2.hash(data.password).catch(err => {
        throw err;
      });

      // Create user in database
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      }).catch(err => {
        throw err;
      });

      const session = await useAppSession();

      await session.update({
        email: user.email,
        id: user.id,
      });

      return {
        error: false,
        userNotFound: false,
        message: 'Account created',
      };


    } catch (error) {
      console.error('[Signup] Error:', error);
      return {
        userNotFound: false,
        error: true,
        message: 'Failed to create account',
      };
    }
  });

export const login = createServerFn({
  method: 'POST',
})
  .validator((data) => {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      throw new Error('Invalid data');
    }
    return validated.data;
  })
  .handler(async ({ data, signal, ...ctx }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email }, select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        return {
          userNotFound: true,
          error: true,
          message: 'Invalid credentials',
        };
      }

      const isValidPassword = await argon2.verify(user.password, data.password);

      if (!isValidPassword) {
        console.error('[Login] Invalid credentials');
        return {
          userNotFound: false,
          error: true,
          message: 'Invalid credentials',
        };
      }

      // Create a session
      const session = await useAppSession();

      // Store the user's email in the session
      await session.update({
        email: user.email,
        id: user.id,
      });

      return {
        error: false,
        userNotFound: false,
        message: 'Logged in',
      }

    } catch (error) {
      console.error('[Login] Error:', error);
      return {
        error: true,
        userNotFound: null,
        message: 'Failed to log in',
      };
    }
  });

export const fetchSessionUser = createServerFn().handler(async () => {
  try {
    // We need to auth on the server so we have access to secure cookies
    const session = await useAppSession();

    if (!session.data.email) {
      return null;
    }

    return {
      ...session.data,
    };
  } catch (error) {
    console.error('[Fetch Session User] Error:', error);
    throw error;
  }
});


export const getCurrentUser = createServerFn().handler(async () => {
  try {
    const session = await useAppSession();

    if (!session.data.email) {
      throw new Error('Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.data.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    console.error('[Get Current User] Error:', error);
    throw error;
  }
});


export const resetPassword = createServerFn({
  method: 'POST',
})
  .validator((data) => {
    const validated = resetPasswordSchema.safeParse(data);
    if (!validated.success) {
      throw new Error('Invalid data');
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return {
          success: false,
          error: 'No account found with this email',
        };
      }

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Save it to the database with an expiration
      // 3. Send an email with a reset link

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process password reset',
      };
    }
  });
