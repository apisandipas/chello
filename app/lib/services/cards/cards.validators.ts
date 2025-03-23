"use server";
import { z } from "zod";

export const createCardValidator = (data: unknown) => {
  const validated = z
    .object({ name: z.string(), columnId: z.string() })
    .safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const updateCardValidator = (data: unknown) => {
  const validated = z
    .object({ id: z.string(), name: z.string(), description: z.string().optional() })
    .safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const archiveCardValidator = (data: unknown) => {
  const validated = z.object({ id: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const getCardValidator = (data: unknown) => {
  const validated = z.object({ id: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
}; 