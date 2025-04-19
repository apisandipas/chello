import { Board, User } from "@prisma/client";

export type BoardWithCounts = Board & {
  _count: {
    columns: number;
    cards: number;
  };
};

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  error: string | null;
}
