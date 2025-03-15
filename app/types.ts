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
