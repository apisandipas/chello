import { createServerFn } from "@tanstack/react-start";
import {
  createColumnValidator,
  archiveColumnValidator,
  updateColumnValidator,
} from "./columns.validators";
import {
  createColumnHandler,
  archiveColumnHandler,
  updateColumnHandler,
} from "./columns.handlers";

export const createColumnFn = createServerFn({
  method: "POST",
})
  .validator(createColumnValidator)
  .handler(createColumnHandler);

export const archiveColumnFn = createServerFn({
  method: "POST",
})
  .validator(archiveColumnValidator)
  .handler(archiveColumnHandler);

export const updateColumnFn = createServerFn({
  method: "POST",
})
  .validator(updateColumnValidator)
  .handler(updateColumnHandler); 