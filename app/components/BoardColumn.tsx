import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column } from "../mock-data";
import { BoardCard } from "./BoardCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface BoardColumnProps {
  column: Column;
}

export function BoardColumn({ column }: BoardColumnProps) {
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
      type: "COLUMN",
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-gray-100 w-80 rounded-lg p-4 touch-none select-none ${
        isDragging ? "opacity-50 border-2 border-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">{column.title}</h2>
        <span className="text-sm text-gray-500">
          {column.cards.length} cards
        </span>
      </div>

      <SortableContext
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {column.cards.map((card) => (
            <BoardCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
