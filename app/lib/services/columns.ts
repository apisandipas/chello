import { z } from "zod";
import prisma from "../db-client";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/lib/utils/use-app-session";

export const createColumnFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({ name: z.string(), boardId: z.string() })
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

      // Verify the board belongs to the user
      const board = await prisma.board.findUnique({
        where: { id: data.boardId, userId: session.data.id },
      });

      if (!board) {
        throw new Error("Board not found");
      }

      const count = await prisma.column.count({
        where: { boardId: data.boardId },
      });
      const column = await prisma.column.create({
        data: {
          name: data.name,
          boardId: data.boardId,
          sortOrder: count,
          userId: session.data.id
        },
      });
      return { column };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create column");
    }
  });

export const archiveColumnFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z.object({ columnId: z.string() }).safeParse(data);
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

      const column = await prisma.column.update({
        where: { id: data.columnId, userId: session.data.id },
        data: { isArchived: true },
      });
      return { column };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to archive column");
    }
  });

export const updateColumnFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({ columnId: z.string(), name: z.string() })
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

      const column = await prisma.column.update({
        where: { id: data.columnId, userId: session.data.id },
        data: { name: data.name },
      });
      return { column };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update column");
    }
  });
