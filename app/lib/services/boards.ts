import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "~/lib/db-client";
import { useAppSession, type SessionUser } from "~/lib/utils/use-app-session";

type ServerContext = {
  user: SessionUser;
};

export const getBoardFn = createServerFn({
  method: "GET",
})
  .validator((data) => {
    const validated = z.object({ boardId: z.string() }).safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
    try {
      const session = await useAppSession();
      if (!session.data || !session.data.id) {
        throw new Error("User not found");
      }
      const board = await prisma.board.findUnique({
        where: { id: data.boardId, userId: session.data.id },
        include: {
          columns: {
            orderBy: {
              sortOrder: "asc",
            },
            where: {
              isArchived: false,
            },
            include: {
              cards: {
                orderBy: {
                  sortOrder: "asc",
                },
                where: {
                  isArchived: false,
                },
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
  });

export const updateColumnOrderFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({
        columns: z.array(
          z.object({
            id: z.string(),
            sortOrder: z.number(),
          })
        ),
      })
      .safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
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
  });

export const updateCardOrderFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({
        cards: z.array(
          z.object({
            id: z.string(),
            sortOrder: z.number(),
            columnId: z.string(),
          })
        ),
      })
      .safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
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
  });

export const getBoardsFn = createServerFn({
  method: "GET",
})
  .validator((data) => {
    const validated = z.object({ userId: z.string() }).safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }
    return validated.data;
  })
  .handler(async () => {
    try {
      const session = await useAppSession();
      if (!session.data || !session.data.id) {
        throw new Error("User not found");
      }
      const boards = await prisma.board.findMany({
        where: { userId: session.data.id },
        include: {
          columns: {
            where: {
              isArchived: false,
            },
            include: {
              _count: {
                select: {
                  cards: {
                    where: {
                      isArchived: false,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!(boards.length > 0)) {
        return []
      }

      // Transform the data to include total counts
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
  });

export const createBoardFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z.object({ name: z.string() }).safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }
    return validated.data;
  })
  .handler(async ({ data }) => {
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
  });
