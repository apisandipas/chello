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
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BoardCard } from "~/components/BoardCard";
import { BoardColumn } from "~/components/BoardColumn";
import {
  getBoardFn,
  updateCardOrderFn,
  updateColumnOrderFn,
} from "~/lib/services/boards";
import type { Board, Card, Column } from "~/types";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [board, setBoard] = useState<Board>(boardData);

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

  const updateColumnOrder = async (columns: Column[]) => {
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

  const updateCardOrder = async (cards: Card[], columnId: string) => {
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
    const isColumn = board.columns.find((col) => col.id === active.id);

    if (isColumn) {
      setActiveColumn(isColumn);
      return;
    }

    const card = board.columns
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
      const isColumn = board.columns.find((col) => col.id === active.id);

      if (isColumn) {
        const oldIndex = board.columns.findIndex((col) => col.id === active.id);
        const newIndex = board.columns.findIndex((col) => col.id === over.id);

        const newColumns = arrayMove(board.columns, oldIndex, newIndex);

        setBoard({
          ...board,
          columns: newColumns,
        });

        // Update the sort order in the database
        await updateColumnOrder(newColumns);
      }
    }

    setActiveColumn(null);
    setActiveCard(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = board.columns
      .flatMap((col) => col.cards)
      .find((card) => card.id === activeId);

    if (!isActiveACard) return;

    const activeColumnId = board.columns.find((col) =>
      col.cards.find((card) => card.id === activeId)
    )?.id;

    const overColumnId =
      board.columns.find((col) => col.cards.find((card) => card.id === overId))
        ?.id || overId;

    if (!activeColumnId || !overColumnId) return;

    setBoard((board) => {
      const activeColumn = board.columns.find(
        (col) => col.id === activeColumnId
      )!;
      const overColumn = board.columns.find((col) => col.id === overColumnId)!;

      const activeCardIndex = activeColumn.cards.findIndex(
        (card) => card.id === activeId
      );
      const overCardIndex = overColumn.cards.findIndex(
        (card) => card.id === overId
      );

      let newBoard;

      if (activeColumnId === overColumnId) {
        // Same column
        const newCards = arrayMove(
          activeColumn.cards,
          activeCardIndex,
          overCardIndex
        );

        newBoard = {
          ...board,
          columns: board.columns.map((col) =>
            col.id === activeColumnId ? { ...col, cards: newCards } : col
          ),
        };

        // Update card order in the database
        void updateCardOrder(newCards, activeColumnId.toString());
      } else {
        // Different column
        const [movedCard] = activeColumn.cards.splice(activeCardIndex, 1);
        overColumn.cards.splice(overCardIndex, 0, movedCard);

        newBoard = {
          ...board,
          columns: board.columns.map((col) => {
            if (col.id === activeColumnId) return activeColumn;
            if (col.id === overColumnId) return overColumn;
            return col;
          }),
        };

        // Update card order in both columns
        void updateCardOrder(activeColumn.cards, activeColumnId.toString());
        void updateCardOrder(overColumn.cards, overColumnId.toString());
      }

      return newBoard;
    });
  };

  const renderBoard = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
      {board.columns.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          enableDragAndDrop={isClient}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
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
              items={board.columns.map((col) => col.id)}
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
