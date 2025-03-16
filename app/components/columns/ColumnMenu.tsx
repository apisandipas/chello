import { Ellipsis } from "lucide-react";
import { archiveColumnFn } from "~/lib/services/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function ColumnMenu({ columnId }: { columnId: string }) {
  const router = useRouter();

  const handleArchiveColumn = async () => {
    const { column } = await archiveColumnFn({ data: { columnId } });
    await router.invalidate();
    toast.success(`Column ${column.name} archived`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="w-4 h-4 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent data-side="left" data-align="end">
        <DropdownMenuLabel>Column Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Add Card</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchiveColumn}>
          Archive Column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
