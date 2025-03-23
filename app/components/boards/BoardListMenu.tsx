

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";

interface BoardListMenuProps {
  showArchived: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (boardId: string) => void;
  onUnarchive: (boardId: string) => void;
  boardId: string;
}

export const BoardListMenu = ({
  showArchived,
  onOpenChange,
  onArchive,
  onUnarchive,
  boardId,
}: BoardListMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };


  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          className={`w-4 h-4 cursor-pointer ${open ? "opacity-100" : ""}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {showArchived ? (
          <DropdownMenuItem onClick={() => onUnarchive(boardId)}>
            Unarchive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onArchive(boardId)}>
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
