import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column } from "../../types";
import { AddAnotherCard } from "../cards/AddAnotherCard";
import { BoardCard } from "../cards/BoardCard";
import { ColumnHeader } from "./ColumnHeader";

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
    <div className="flex flex-col gap-2">
      {column.cards.map((card) => (
        <BoardCard
          key={card.id}
          card={card}
          enableDragAndDrop={enableDragAndDrop}
        />
      ))}
      <AddAnotherCard columnId={column.id} />
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
      className={`bg-gray-200 min-w-80 rounded-lg p-4 pt-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...(enableDragAndDrop ? { ...attributes, ...listeners } : {})}
        className={`flex items-center justify-between mb-4 ${
          enableDragAndDrop ? "cursor-grab" : ""
        }`}
      >
        <ColumnHeader column={column} />
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
