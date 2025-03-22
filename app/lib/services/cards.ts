import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "../db-client";

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
      const card = await prisma.card.create({
        data: { name: data.name, columnId: data.columnId },
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
      const card = await prisma.card.update({
        where: { id: data.id },
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
      const card = await prisma.card.update({
        where: { id: data.id },
        data: { isArchived: true },
      });
      return { card };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to archive card");
    }
  });
