import { Card } from "../../types";
import { useState, useRef, useEffect } from "react";

interface CardContentProps {
  card: Card;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  persistEdit: (cardId: string, name: string) => void;
}

export const CardContent = ({
  card,
  isEditing,
  setIsEditing,
  persistEdit,
}: CardContentProps) => {
  const [name, setName] = useState(card.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isEditing) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isEditing]);

  const persistNameChange = () => {
    if (name !== card.name && name !== "") {
      persistEdit(card.id, name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      await persistNameChange();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        className="font-medium text-gray-900 pr-6 border border-blue-500 rounded-md p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={inputRef}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onKeyDown={handleKeyDown}
        onBlur={persistNameChange}
      />
    );
  }

  return <h3 className="font-medium text-gray-900 pr-6">{card.name}</h3>;
};
