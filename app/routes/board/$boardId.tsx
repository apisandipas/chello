import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BoardCard } from "~/components/cards/BoardCard";
import { BoardColumn } from "~/components/columns/BoardColumn";
import { AddAnotherColumn } from "~/components/columns/AddAnotherColumn";
import {
  getBoardFn,
  updateCardOrderFn,
  updateColumnOrderFn,
} from "~/lib/services/boards";
import type { Card, Column } from "~/types";
import { BoardHeader } from "~/components/boards/BoardHeader";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export const Route = createFileRoute("/board/$boardId")({
  component: BoardComponent,
  loader: async ({ params }) =>
    getBoardFn({ data: { boardId: params.boardId } }),
});

function BoardComponent() {
  const boardData = Route.useLoaderData();

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpdateColumnOrder = async (columns: Column[]) => {
    try {
      await updateColumnOrderFn({
        data: {
          columns: columns.map((column, index) => ({
            id: column.id,
            sortOrder: index,
          })),
        },
      });
    } catch (error) {
      console.error("Failed to update column order:", error);
    }
  };

  const handleUpdateCardOrder = async (cards: Card[], columnId: string) => {
    try {
      await updateCardOrderFn({
        data: {
          cards: cards.map((card, index) => ({
            id: card.id,
            sortOrder: index,
            columnId: columnId,
          })),
        },
      });
    } catch (error) {
      console.error("Failed to update card order:", error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const isColumn = boardData.columns.find((col) => col.id === active.id);

    if (isColumn) {
      setActiveColumn(isColumn);
      return;
    }

    const card = boardData.columns
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);

    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveColumn(null);
      setActiveCard(null);
      return;
    }

    if (active.id !== over.id) {
      const isColumn = boardData.columns.find((col) => col.id === active.id);

      if (isColumn) {
        const oldIndex = boardData.columns.findIndex(
          (col) => col.id === active.id
        );
        const newIndex = boardData.columns.findIndex(
          (col) => col.id === over.id
        );

        // Update the local state immediately
        boardData.columns = arrayMove(boardData.columns, oldIndex, newIndex);

        // Update the sort order in the database in the background
        handleUpdateColumnOrder(boardData.columns).then(() => {
          router.invalidate();
        });
      }
    }

    setActiveColumn(null);
    setActiveCard(null);
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = boardData.columns
      .flatMap((col) => col.cards)
      .find((card) => card.id === activeId);

    if (!isActiveACard) return;

    const activeColumn = boardData.columns.find((col) =>
      col.cards.find((card) => card.id === activeId)
    );

    const overColumn = boardData.columns.find(
      (col) => col.id === overId || col.cards.some((card) => card.id === overId)
    );

    if (!activeColumn || !overColumn) return;

    const activeCardIndex = activeColumn.cards.findIndex(
      (card) => card.id === activeId
    );
    const overCardIndex = overColumn.cards.findIndex(
      (card) => card.id === overId
    );

    if (activeColumn.id === overColumn.id) {
      // Same column
      const newCards = arrayMove(
        activeColumn.cards,
        activeCardIndex,
        overCardIndex
      );
      // Update local state immediately
      activeColumn.cards = newCards;
      // Update card order in the database in the background
      handleUpdateCardOrder(newCards, activeColumn.id.toString()).then(() => {
        router.invalidate();
      });
    } else {
      // Different column
      const updatedActiveCards = [...activeColumn.cards];
      const updatedOverCards = [...overColumn.cards];
      const [movedCard] = updatedActiveCards.splice(activeCardIndex, 1);

      // If dropping on a column (not a card), append to the end
      const insertIndex =
        overId === overColumn.id ? overColumn.cards.length : overCardIndex;

      updatedOverCards.splice(insertIndex, 0, movedCard);

      // Update local state immediately
      activeColumn.cards = updatedActiveCards;
      overColumn.cards = updatedOverCards;

      // Update card order in both columns in the background
      Promise.all([
        handleUpdateCardOrder(updatedActiveCards, activeColumn.id.toString()),
        handleUpdateCardOrder(updatedOverCards, overColumn.id.toString()),
      ]).then(() => {
        router.invalidate();
      });
    }
  };

  const renderBoard = () => (
    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 items-start h-[calc(100vh-120px)]">
      {boardData.columns.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          enableDragAndDrop={isClient}
        />
      ))}
      <AddAnotherColumn boardId={boardData.id} />
    </div>
  );
  return (
    <div className="relative h-screen bg-gray-100 w-full overflow-hidden">
      <div className="p-4 h-full overflow-x-auto">
        <BoardHeader board={boardData} />
        {isClient ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext
              items={boardData.columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {renderBoard()}
            </SortableContext>
            <DragOverlay dropAnimation={dropAnimation}>
              {activeColumn && (
                <BoardColumn column={activeColumn} enableDragAndDrop={true} />
              )}
              {activeCard && (
                <BoardCard card={activeCard} enableDragAndDrop={true} />
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          renderBoard()
        )}
      </div>

      <Outlet />
    </div>
  );
}
