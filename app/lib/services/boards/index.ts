import { createServerFn } from "@tanstack/react-start";
import {
  updateBoardValidator,
  getBoardValidator,
  updateColumnOrderValidator,
  updateCardOrderValidator,
  getBoardsValidator,
  createBoardValidator,
  archiveBoardValidator,
} from "./boards.validators";
import {
  updateBoardHandler,
  getBoardHandler,
  updateColumnOrderHandler,
  updateCardOrderHandler,
  getBoardsHandler,
  createBoardHandler,
  archiveBoardHandler,
} from "./boards.handlers";

export const updateBoardFn = createServerFn({
  method: "POST",
})
  .validator(updateBoardValidator)
  .handler(updateBoardHandler);

export const getBoardFn = createServerFn({
  method: "GET",
})
  .validator(getBoardValidator)
  .handler(getBoardHandler);

export const updateColumnOrderFn = createServerFn({
  method: "POST",
})
  .validator(updateColumnOrderValidator)
  .handler(updateColumnOrderHandler);

export const updateCardOrderFn = createServerFn({
  method: "POST",
})
  .validator(updateCardOrderValidator)
  .handler(updateCardOrderHandler);

export const getBoardsFn = createServerFn({
  method: "GET",
})
  .validator(getBoardsValidator)
  .handler(getBoardsHandler);

export const createBoardFn = createServerFn({
  method: "POST",
})
  .validator(createBoardValidator)
  .handler(createBoardHandler);

export const archiveBoardFn = createServerFn({
  method: "POST",
})
  .validator(archiveBoardValidator)
  .handler(archiveBoardHandler);
