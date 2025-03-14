import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { BoardCard } from "../../components/BoardCard";
import { BoardColumn } from "../../components/BoardColumn";
import type { Card, Column } from "../../mock-data";
import { mockBoard } from "../../mock-data";

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
});

function BoardComponent() {
  const { boardId } = useParams({ from: "/board/$boardId" });
  const [board, setBoard] = useState(() => {
    // In a real app, we would fetch the board data using the boardId
    // For now, we'll just check if the mock board matches
    if (mockBoard.id === boardId) {
      return mockBoard;
    }
    return {
      ...mockBoard,
      id: boardId,
      title: `Board ${boardId}`,
    };
  });
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
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
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

        setBoard({
          ...board,
          columns: arrayMove(board.columns, oldIndex, newIndex),
        });
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
      }

      return newBoard;
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext
              items={board.columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {board.columns.map((column) => (
                <BoardColumn key={column.id} column={column} />
              ))}
            </SortableContext>
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeColumn && <BoardColumn column={activeColumn} />}
            {activeCard && <BoardCard card={activeCard} />}
          </DragOverlay>
        </DndContext>
      </div>

      <Outlet />
    </div>
  );
}
