import { createFileRoute, Link } from "@tanstack/react-router";
import { getBoardsFn } from "~/lib/services/boards";
import type { Board } from "@prisma/client";

type BoardWithCounts = Board & {
  _count: {
    columns: number;
    cards: number;
  };
};

export const Route = createFileRoute("/boards")({
  component: RouteComponent,
  loader: async () => {
    const boards = await getBoardsFn();
    return { boards };
  },
});

function RouteComponent() {
  const { boards } = Route.useLoaderData();
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Boards</h1>
      </div>
      <div className="flex-1 max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardListCard key={board.id} board={board as BoardWithCounts} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardListCard({ board }: { board: BoardWithCounts }) {
  return (
    <Link to="/board/$boardId" params={{ boardId: board.id }}>
      <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <h2 className="text-lg font-bold">{board.name}</h2>
        <div className="text-sm text-gray-500">
          {board._count.columns} columns
        </div>
        <div className="text-sm text-gray-500">
          {board._count.cards} cards
        </div>
      </div>
    </Link>
  );
}
