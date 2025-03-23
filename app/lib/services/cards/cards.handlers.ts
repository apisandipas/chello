"use server";
import prisma from "../../db-client";
import { useAppSession } from "../../utils/use-app-session";

export const createCardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const column = await prisma.column.findUnique({
      where: { id: data.columnId, userId: session.data.id },
      include: { board: true }
    });

    if (!column) {
      throw new Error("Column not found");
    }

    const count = await prisma.card.count({
      where: { columnId: data.columnId },
    });

    const card = await prisma.card.create({
      data: {
        name: data.name,
        columnId: data.columnId,
        sortOrder: count,
        userId: session.data.id
      },
    });
    return { card };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCardHandler = async ({ data }) => {
  console.log("updateCardHandler", data);
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const card = await prisma.card.update({
      where: { id: data.id, userId: session.data.id },
      data: { name: data.name, description: data.description },
    });
    return { card };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const archiveCardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const card = await prisma.card.update({
      where: { id: data.id, userId: session.data.id },
      data: { isArchived: true },
    });
    return { card };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCardHandler = async ({ data }) => {
  try {
    const session = await useAppSession();
    if (!session.data || !session.data.id) {
      throw new Error("User not found");
    }

    const card = await prisma.card.findUnique({
      where: { id: data.id, userId: session.data.id },
    });
    return { card };
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 