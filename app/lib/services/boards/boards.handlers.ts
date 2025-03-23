"use server";
import { Column, Card } from "@prisma/client";
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

export const updateColumnOrderHandler = async ({ data }: { data: { columns: { id: string, sortOrder: number }[] } }) => {
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

export const updateCardOrderHandler = async ({ data }: { data: { cards: { id: string, sortOrder: number, columnId: string }[] } }) => {
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

export const getBoardsHandler = async ({ data }: { data: { userId: string, showArchived: boolean } }) => {
  console.log('getBoardsHandler', data);
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }
    const boards = await prisma.board.findMany({
      where: { userId: session.data.id, isArchived: data.showArchived ? true : false },
      include: {
        columns: {
          where: { isArchived: data.showArchived ? true : false },
          include: {
            _count: {
              select: {
                cards: {
                  where: { isArchived: data.showArchived ? true : false },
                },
              },
            },
          },
        },
      },
    });
    // console.log('boards', boards);

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

    await prisma.$transaction([
      // Archive all cards in the board
      prisma.card.updateMany({
        where: {
          column: {
            boardId: data.boardId,
            userId: session.data.id
          }
        },
        data: { isArchived: true }
      }),
      // Archive all columns in the board
      prisma.column.updateMany({
        where: {
          boardId: data.boardId,
          userId: session.data.id
        },
        data: { isArchived: true }
      }),
      // Archive the board itself
      prisma.board.update({
        where: { id: data.boardId, userId: session.data.id },
        data: { isArchived: true }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to archive board");
  }
};

export const unarchiveBoardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    await prisma.$transaction([
      // Archive all cards in the board
      prisma.card.updateMany({
        where: {
          column: {
            boardId: data.boardId,
            userId: session.data.id
          }
        },
        data: { isArchived: false }
      }),
      // Archive all columns in the board
      prisma.column.updateMany({
        where: {
          boardId: data.boardId,
          userId: session.data.id
        },
        data: { isArchived: false }
      }),
      // Archive the board itself
      prisma.board.update({
        where: { id: data.boardId, userId: session.data.id },
        data: { isArchived: false }
      })
    ]);



    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to unarchive board");
  }
};
