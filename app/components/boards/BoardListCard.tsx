import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { archiveBoardFn, unarchiveBoardFn, updateBoardFn } from "~/lib/services/boards";
import { BoardWithCounts } from "~/types";
import { BoardListMenu } from "./BoardListMenu";
import { useState } from "react";

export function BoardListCard({ showArchived, board }: { showArchived: boolean, board: BoardWithCounts }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleArchive = async () => {
    await archiveBoardFn({ data: { boardId: board.id } });
    await router.invalidate();
    toast.success("Board archived");
  };

  const handleUnarchive = async () => {
    await unarchiveBoardFn({ data: { boardId: board.id } });
    await router.invalidate();
    toast.success("Board unarchived");
  };

  return (
    <Link to="/board/$boardId" params={{ boardId: board.id }}>
      <div className="bg-white relative rounded-lg shadow-md p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <h2 className="text-lg font-bold">{board.name}</h2>
        <div className="text-sm text-gray-500">
          {board._count.columns} columns
        </div>
        <div className="text-sm text-gray-500">
          {board._count.cards} cards
        </div>
        <div
          className={`absolute top-2 right-2 transition-opacity "opacity-100`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <BoardListMenu
            showArchived={showArchived}
            onOpenChange={setIsMenuOpen}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            boardId={board.id}
          />
        </div>
      </div>
    </Link>
  );
}