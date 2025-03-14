import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../mock-data";

interface BoardCardProps {
  card: Card;
}

export function BoardCard({ card }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium text-gray-900">{card.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{card.description}</p>
      {card.labels.length > 0 && (
        <div className="flex gap-1 mt-2">
          {card.labels.map((label) => (
            <span
              key={label}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
