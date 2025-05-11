import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createColumnHandler,
  archiveColumnHandler,
  updateColumnHandler,
} from "./columns.handlers";

export const createColumnFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ name: z.string(), boardId: z.string() }))
  .handler(createColumnHandler);

export const archiveColumnFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ columnId: z.string() }))
  .handler(archiveColumnHandler);

export const updateColumnFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ columnId: z.string(), name: z.string() }))
  .handler(updateColumnHandler);

