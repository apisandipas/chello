import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../../types";
import { Link, useParams } from "@tanstack/react-router";

interface BoardCardProps {
  card: Card;
  enableDragAndDrop?: boolean;
}

export function BoardCard({ card, enableDragAndDrop = false }: BoardCardProps) {
  const { boardId } = useParams({ from: "/board/$boardId" });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !enableDragAndDrop });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Link
      to="/board/$boardId/card/$cardId"
      params={{ boardId, cardId: card.id }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      >
        <h3 className="font-medium text-gray-900">{card.name}</h3>
      </div>
    </Link>
  );
}
