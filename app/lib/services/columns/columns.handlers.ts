"use server";
import prisma from "../../db-client";
import { useAppSession } from "~/lib/utils/use-app-session";

export const createColumnHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const board = await prisma.board.findUnique({
      where: { id: data.boardId, userId: session.data.id },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    const count = await prisma.column.count({
      where: { boardId: data.boardId },
    });
    const column = await prisma.column.create({
      data: {
        name: data.name,
        boardId: data.boardId,
        sortOrder: count,
        userId: session.data.id
      },
    });
    return { column };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create column");
  }
};

export const archiveColumnHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const column = await prisma.column.update({
      where: { id: data.columnId, userId: session.data.id },
      data: { isArchived: true },
    });
    return { column };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to archive column");
  }
};

export const updateColumnHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const column = await prisma.column.update({
      where: { id: data.columnId, userId: session.data.id },
      data: { name: data.name },
    });
    return { column };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update column");
  }
}; 