import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "../db-client";
import { useAppSession } from "~/lib/utils/use-app-session";

export const createCardFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({ name: z.string(), columnId: z.string() })
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

      // Verify the column belongs to the user
      const column = await prisma.column.findUnique({
        where: { id: data.columnId, userId: session.data.id },
        include: { board: true }
      });

      if (!column) {
        throw new Error("Column not found");
      }

      const count = await prisma.card.count({
        where: { columnId: data.columnId },
      });

      const card = await prisma.card.create({
        data: {
          name: data.name,
          columnId: data.columnId,
          sortOrder: count,
          userId: session.data.id
        },
      });
      return { card };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create card");
    }
  });

export const updateCardFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z
      .object({ id: z.string(), name: z.string() })
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

      const card = await prisma.card.update({
        where: { id: data.id, userId: session.data.id },
        data: { name: data.name },
      });
      return { card };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update card");
    }
  });

export const archiveCardFn = createServerFn({
  method: "POST",
})
  .validator((data) => {
    const validated = z.object({ id: z.string() }).safeParse(data);
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

      const card = await prisma.card.update({
        where: { id: data.id, userId: session.data.id },
        data: { isArchived: true },
      });
      return { card };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to archive card");
    }
  });
