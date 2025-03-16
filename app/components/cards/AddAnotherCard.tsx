import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createCardFn } from "~/lib/services/cards";

export function AddAnotherCard({ columnId }: { columnId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleAddCard = async () => {
    const cardName = inputRef.current?.value;
    if (cardName) {
      setIsAdding(false);
      await createCardFn({ data: { name: cardName, columnId } });
      await router.invalidate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCard();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
    }
  };

  return (
    <>
      {isAdding ? (
        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <input
            type="text"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg px-5 py-2 bg-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded line-height-[1.5]"
            >
              Add
            </button>

            <div
              className="text-gray-500 font-bold  text-3xl "
              onClick={() => setIsAdding(false)}
            >
              ×
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex px-5 py-2 rounded-lg  cursor-pointer  hover:bg-gray-100"
          onClick={() => setIsAdding(true)}
        >
          + Add Another Card
        </div>
      )}
    </>
  );
}
