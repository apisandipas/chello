"use server";
import prisma from "~/lib/db-client";
import { useAppSession } from "~/lib/utils/use-app-session";

export const updateBoardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    await prisma.board.update({
      where: { id: data.id, userId: session.data.id },
      data: { name: data.name },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBoardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    const board = await prisma.board.findUnique({
      where: { id: data.boardId, userId: session.data.id },
      include: {
        columns: {
          orderBy: { sortOrder: "asc" },
          where: { isArchived: false },
          include: {
            cards: {
              orderBy: { sortOrder: "asc" },
              where: { isArchived: false },
            },
          },
        },
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    return board;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get board");
  }
};

export const updateColumnOrderHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    await prisma.$transaction(
      data.columns.map((column) =>
        prisma.column.update({
          where: { id: column.id, userId: session.data.id },
          data: { sortOrder: column.sortOrder },
        })
      )
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update column order");
  }
};

export const updateCardOrderHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    await prisma.$transaction(
      data.cards.map((card) =>
        prisma.card.update({
          where: { id: card.id, userId: session.data.id },
          data: {
            sortOrder: card.sortOrder,
            columnId: card.columnId,
          },
        })
      )
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update card order");
  }
};

export const getBoardsHandler = async () => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    const boards = await prisma.board.findMany({
      where: { userId: session.data.id, isArchived: false },
      include: {
        columns: {
          where: { isArchived: false },
          include: {
            _count: {
              select: {
                cards: {
                  where: { isArchived: false },
                },
              },
            },
          },
        },
      },
    });

    if (!(boards.length > 0)) {
      return [];
    }

    return boards.map(board => ({
      ...board,
      _count: {
        columns: board.columns.length,
        cards: board.columns.reduce((total, column) => total + column._count.cards, 0),
      },
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBoardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    const board = await prisma.board.create({
      data: {
        name: data.name,
        userId: session.data.id
      },
    });
    return board;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create board");
  }
};

export const archiveBoardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    await prisma.board.update({
      where: { id: data.boardId, userId: session.data.id },
      data: { isArchived: true },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to archive board");
  }
};
