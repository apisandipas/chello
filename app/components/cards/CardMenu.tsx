import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";

interface CardMenuProps {
  onOpenChange: (open: boolean) => void;
  setIsEditing: (edit: boolean) => void;
  onArchive: (cardId: string) => void;
  cardId: string;
}

export const CardMenu = ({
  onOpenChange,
  setIsEditing,
  onArchive,
  cardId,
}: CardMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          className={`w-4 h-4 cursor-pointer ${open ? "opacity-100" : ""}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive(cardId)}>
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
