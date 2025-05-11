import { createServerFn } from "@tanstack/react-start";
import {
  updateBoardHandler,
  getBoardHandler,
  updateColumnOrderHandler,
  updateCardOrderHandler,
  getBoardsHandler,
  createBoardHandler,
  archiveBoardHandler,
  unarchiveBoardHandler,
} from "./boards.handlers";
import { z } from "zod";

export const updateBoardFn = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  )
  .handler(updateBoardHandler);

export const getBoardFn = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      boardId: z.string(),
      isArchived: z.boolean().optional(),
    }),
  )
  .handler(getBoardHandler);

export const updateColumnOrderFn = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      columns: z.array(
        z.object({
          id: z.string(),
          sortOrder: z.number(),
        }),
      ),
    }),
  )
  .handler(updateColumnOrderHandler);

export const updateCardOrderFn = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      cards: z.array(
        z.object({
          id: z.string(),
          sortOrder: z.number(),
          columnId: z.string(),
        }),
      ),
    }),
  )
  .handler(updateCardOrderHandler);

export const getBoardsFn = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      userId: z.string(),
      showArchived: z.boolean().optional().default(false),
    }),
  )
  .handler(getBoardsHandler);

export const createBoardFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ name: z.string() }))
  .handler(createBoardHandler);

export const archiveBoardFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ boardId: z.string() }))
  .handler(archiveBoardHandler);

export const unarchiveBoardFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ boardId: z.string() }))
  .handler(unarchiveBoardHandler);
