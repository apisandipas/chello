import { Column } from "~/types";
import { ColumnMenu } from "./ColumnMenu";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { updateColumnFn } from "~/lib/services/columns";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function ColumnHeader({ column }: { column: Column }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(column.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const persistNameChange = async () => {
    if (editedName === column.name || editedName === "") return;
    await updateColumnFn({
      data: { name: editedName, columnId: column.id },
    });
    await router.invalidate();
    toast.success("Column name updated");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.stopPropagation();
      return;
    }

    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      await persistNameChange();
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    setEditedName(column.name);
    await persistNameChange();
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-300 bg-white p-[3px]"
          />
        ) : (
          <h2
            className="font-semibold text-gray-700 truncate w-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
              setEditedName(column.name);
            }}
          >
            {column.name}
          </h2>
        )}
      </div>
      <div className="flex-shrink-0 ml-2">
        <ColumnMenu columnId={column.id} />
      </div>
    </div>
  );
}
