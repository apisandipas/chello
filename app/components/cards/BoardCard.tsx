import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { Card } from "../../types";
import { CardMenu } from "./CardMenu";
import { archiveCardFn, updateCardFn } from "../../lib/services/cards";
import { toast } from "sonner";
import { CardContent } from "./CardContent";

interface BoardCardProps {
  card: Card;
  enableDragAndDrop?: boolean;
}

export function BoardCard({ card, enableDragAndDrop = false }: BoardCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { boardId } = useParams({ from: "/board/$boardId" });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: !enableDragAndDrop || isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdateCard = async (cardId: string, name: string) => {
    await updateCardFn({ data: { id: cardId, name } });
    await router.invalidate();
    toast.success("Card updated");
  };

  const handleArchiveCard = async (cardId: string) => {
    await archiveCardFn({ data: { id: cardId } });
    await router.invalidate();
    toast.success("Card archived");
  };

  return (
    <Link
      to="/board/$boardId/card/$cardId"
      params={{ boardId, cardId: card.id }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...(isEditing ? {} : { ...attributes, ...listeners })}
        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow relative group"
      >
        <CardContent
          card={card}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          persistEdit={handleUpdateCard}
        />
        <div
          className={`absolute top-2 right-2 transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <CardMenu
            onOpenChange={setIsMenuOpen}
            setIsEditing={setIsEditing}
            onArchive={handleArchiveCard}
            cardId={card.id}
          />
        </div>
      </div>
    </Link>
  );
}
