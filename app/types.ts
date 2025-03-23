export interface Card {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  columnId: string;
}

export interface Column {
  id: string;
  name: string;
  cards: Card[];
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

export type BoardWithCounts = Board & {
  _count: {
    columns: number;
    cards: number;
  };
};

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

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
