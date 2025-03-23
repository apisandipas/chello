import { Card } from "@prisma/client";
import { useRouter } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { updateCardFn } from "~/lib/services/cards";

export default function CardHeader({ card }: { card: Card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await persistCardName();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const persistCardName = async () => {
    setIsEditing(false);
    await updateCardFn({ data: { id: card.id, name: name } });
    router.invalidate();
  };

  const handleNameBlur = async () => {
    setIsEditing(false);
    await persistCardName();
  };

  return (
    <div className="w-full">
      {isEditing ? (
        <input
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type="text"
          value={name}
          className="w-full text-xl font-semibold border-none  focus:ring-0 border-b-2 border-cyan-700"
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
      ) : (
        <h2 className="text-xl font-semibold w-full" onClick={() => setIsEditing(true)}>{card.name}</h2>
      )}
    </div>
  );
}