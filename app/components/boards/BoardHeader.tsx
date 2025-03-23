import { Board } from "~/types";
import { useRef, useState, useEffect } from "react";
import { updateBoardFn } from "~/lib/services/boards";
import { useRouter } from "@tanstack/react-router";

export function BoardHeader({ board }: { board: Board }) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editedName, setEditedName] = useState(board.name);
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const persistNameChange = async () => {
    await updateBoardFn({ data: { id: board.id, name: editedName } });
    setIsEditing(false);
    router.invalidate();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      persistNameChange();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  const handleClick = () => {
    setIsEditing(true);
  }

  return (
    isEditing ? (
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}

        className="rounded-lg border border-gray-300 bg-white p-2 text-2xl font-bold mb-4"
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
      />
    ) : (
      <h1 className="text-2xl font-bold mb-4" onClick={handleClick}>{board.name}</h1>
    )
  )
}