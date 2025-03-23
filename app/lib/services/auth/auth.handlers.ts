"use server";
import * as argon2 from 'argon2';
import prisma from '../../db-client';
import { useAppSession } from '../../utils/use-app-session';

export const signupHandler = async ({ data }) => {
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

    const hashedPassword = await argon2.hash(data.password).catch(err => {
      throw err;
    });

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
      role: user.role,
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
};

export const loginHandler = async ({ data }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
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

    const session = await useAppSession();
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
};

export const fetchSessionUserHandler = async () => {
  try {
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
};

export const getCurrentUserHandler = async () => {
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
};

export const resetPasswordHandler = async ({ data }) => {
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
}; 