import { z } from "zod";

export const updateBoardValidator = (data: unknown) => {
  const validated = z.object({ id: z.string(), name: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const getBoardValidator = (data: unknown) => {
  const validated = z.object({ boardId: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const updateColumnOrderValidator = (data: unknown) => {
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
};

export const updateCardOrderValidator = (data: unknown) => {
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
};

export const getBoardsValidator = (data: unknown) => {
  const validated = z.object({ userId: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const createBoardValidator = (data: unknown) => {
  const validated = z.object({ name: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};

export const archiveBoardValidator = (data: unknown) => {
  const validated = z.object({ boardId: z.string() }).safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid data");
  }
  return validated.data;
};
