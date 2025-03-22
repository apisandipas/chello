import { z } from "zod";
import prisma from "~/lib/db-client";
import { createServerFn } from "@tanstack/react-start";

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
    const board = await prisma.board.findUnique({
      where: { id: data.boardId },
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
    await prisma.$transaction(
      data.columns.map((column) =>
        prisma.column.update({
          where: { id: column.id },
          data: { sortOrder: column.sortOrder },
        })
      )
    );
    return { success: true };
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
    await prisma.$transaction(
      data.cards.map((card) =>
        prisma.card.update({
          where: { id: card.id },
          data: {
            sortOrder: card.sortOrder,
            columnId: card.columnId,
          },
        })
      )
    );
    return { success: true };
  });

export const getBoardsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const boards = await prisma.board.findMany({
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

  // Transform the data to include total counts
  return boards.map(board => ({
    ...board,
    _count: {
      columns: board.columns.length,
      cards: board.columns.reduce((total, column) => total + column._count.cards, 0),
    },
  }));
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
    const board = await prisma.board.create({
      data: { name: data.name },
    });
    return board;
  });
