"use server";
import { z } from "zod";

export const createColumnValidator = (data: unknown) => {
  const validated = z
    .object({ name: z.string(), boardId: z.string() })
    .safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const archiveColumnValidator = (data: unknown) => {
  const validated = z.object({ columnId: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const updateColumnValidator = (data: unknown) => {
  const validated = z
    .object({ columnId: z.string(), name: z.string() })
    .safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
}; 