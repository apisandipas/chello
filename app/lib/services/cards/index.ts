import { createServerFn } from "@tanstack/react-start";
import {
  createCardValidator,
  updateCardValidator,
  archiveCardValidator,
  getCardValidator,
} from "./cards.validators";
import {
  createCardHandler,
  updateCardHandler,
  archiveCardHandler,
  getCardHandler,
} from "./cards.handlers";

export const createCardFn = createServerFn({
  method: "POST",
})
  .validator(createCardValidator)
  .handler(createCardHandler);

export const updateCardFn = createServerFn({
  method: "POST",
})
  .validator(updateCardValidator)
  .handler(updateCardHandler);

export const archiveCardFn = createServerFn({
  method: "POST",
})
  .validator(archiveCardValidator)
  .handler(archiveCardHandler);

export const getCardFn = createServerFn({
  method: "GET",
})
  .validator(getCardValidator)
  .handler(getCardHandler); 