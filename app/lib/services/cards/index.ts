import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createCardHandler,
  updateCardHandler,
  archiveCardHandler,
  getCardHandler,
} from "./cards.handlers";

export const createCardFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ name: z.string(), columnId: z.string() }))
  .handler(createCardHandler);

export const updateCardFn = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
    }),
  )
  .handler(updateCardHandler);

export const archiveCardFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ id: z.string() }))
  .handler(archiveCardHandler);

export const getCardFn = createServerFn({
  method: "GET",
})
  .validator(z.object({ id: z.string() }))
  .handler(getCardHandler);

