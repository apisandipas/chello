import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column } from "../types";
import { BoardCard } from "./BoardCard";

interface BoardColumnProps {
  column: Column;
  enableDragAndDrop?: boolean;
}

export function BoardColumn({
  column,
  enableDragAndDrop = false,
}: BoardColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: !enableDragAndDrop,
  });

  const renderCards = () => (
    <div className="space-y-3">
      {column.cards.map((card) => (
        <BoardCard
          key={card.id}
          card={card}
          enableDragAndDrop={enableDragAndDrop}
        />
      ))}
    </div>
  );

  const style = enableDragAndDrop
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-100 w-80 rounded-lg p-4 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...(enableDragAndDrop ? { ...attributes, ...listeners } : {})}
        className={`flex items-center justify-between mb-4 ${
          enableDragAndDrop ? "cursor-grab" : ""
        }`}
      >
        <h2 className="font-semibold text-gray-700">{column.name}</h2>
        <span className="text-sm text-gray-500">
          {column.cards.length} cards
        </span>
      </div>

      {enableDragAndDrop ? (
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {renderCards()}
        </SortableContext>
      ) : (
        renderCards()
      )}
    </div>
  );
}
