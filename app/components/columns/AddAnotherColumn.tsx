import { useEffect, useRef, useState } from "react";
import { createColumnFn } from "~/lib/services/columns";
import { useRouter } from "@tanstack/react-router";

export function AddAnotherColumn({ boardId }: { boardId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleAddColumn = async () => {
    if (inputRef.current) {
      await createColumnFn({
        data: { name: inputRef.current.value, boardId },
      });
      setIsAdding(false);
      await router.invalidate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddColumn();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
    }
  };

  return (
    <>
      {isAdding ? (
        <div className="flex flex-col gap-2  rounded-lg  cursor-pointer  hover:bg-gray-100">
          <div className="flex flex-col gap-2 bg-gray-200 min-w-80 rounded-lg p-4">
            <input
              ref={inputRef}
              type="text"
              className="w-full rounded-lg p-2 border border-gray-300"
              onKeyDown={handleKeyDown}
            />

            <div className="flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded line-height-[1.5]"
                onClick={handleAddColumn}
              >
                Add Column
              </button>
              <div
                className="text-gray-500 font-bold  text-3xl "
                onClick={() => setIsAdding(false)}
              >
                ×
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex px-4 py-2 rounded-lg  cursor-pointer bg-gray-200 hover:bg-gray-300 min-w-80 "
          onClick={() => setIsAdding(true)}
        >
          + Add Column
        </div>
      )}
    </>
  );
}
