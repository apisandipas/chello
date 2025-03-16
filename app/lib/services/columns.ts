import { z } from "zod";
import prisma from "../db-client";
import { createServerFn } from "@tanstack/react-start";

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
      const count = await prisma.column.count({
        where: { boardId: data.boardId },
      });
      const column = await prisma.column.create({
        data: { name: data.name, boardId: data.boardId, sortOrder: count },
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
      const column = await prisma.column.update({
        where: { id: data.columnId },
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
      const column = await prisma.column.update({
        where: { id: data.columnId },
        data: { name: data.name },
      });
      return { column };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update column");
    }
  });
