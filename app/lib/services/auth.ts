import { createServerFn } from '@tanstack/react-start';
import * as argon2 from 'argon2';
import prisma from '../db-client';
import type { User } from '@prisma/client';
import { z } from 'zod';
import { generateToken } from '../utils/jwt';

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
    console.log('[Signup Validator] Received input:', data);
    const validated = signupSchema.safeParse(data);
    if (!validated.success) {
      console.error('[Signup Validator] Validation failed:', validated.error);
      throw new Error('Invalid data');
    }
    console.log('[Signup Validator] Validated data:', validated.data);
    return validated.data;
  })
  .handler(async ({ data }) => {
    try {
      console.log('[Signup Handler] Processing data:', data);
      console.log('[Signup Handler] Prisma instance:', { 
        prismaExists: !!prisma,
        models: Object.keys(prisma),
        userModel: !!prisma.user,
        modelMethods: Object.keys(prisma.user || {}),
      });
      
      // Check if user already exists
      console.log('[Signup Handler] Checking for existing user with email:', data.email);
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      }).catch(err => {
        console.error('[Signup Handler] Error checking existing user:', err);
        throw err;
      });

      if (existingUser) {
        console.log('[Signup Handler] User already exists');
        return {
          user: null,
          token: null,
          error: 'Email already in use',
        };
      }

      // Hash password with Argon2
      console.log('[Signup Handler] Hashing password');
      const hashedPassword = await argon2.hash(data.password).catch(err => {
        console.error('[Signup Handler] Error hashing password:', err);
        throw err;
      });
      
      // Create user in database
      console.log('[Signup Handler] Creating new user');
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      }).catch(err => {
        console.error('[Signup Handler] Error creating user:', err);
        throw err;
      });

      const { password, ...userWithoutPassword } = user;
      const token = generateToken(user);
      
      console.log('[Signup Handler] User created successfully:', { userId: user.id, email: user.email });
      return {
        user: userWithoutPassword,
        token,
        error: null,
      };
    } catch (error) {
      console.error('[Signup Handler] Error:', error);
      return {
        user: null,
        token: null,
        error: 'Failed to create account',
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
  .handler(async ({ data  }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return {
          user: null,
          token: null,
          error: 'Invalid credentials',
        };
      }

      const isValidPassword = await argon2.verify(user.password, data.password);

      if (!isValidPassword) {
        return {
          user: null,
          token: null,
          error: 'Invalid credentials',
        };
      }

      const { password, ...userWithoutPassword } = user;
      const token = generateToken(user);

      return {
        user: userWithoutPassword,
        token,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        token: null,
        error: 'Failed to log in',
      };
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
