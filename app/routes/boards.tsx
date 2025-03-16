import { createFileRoute, Link } from "@tanstack/react-router";
import { getBoardsFn } from "~/lib/services/boards";
import type { Board } from "@prisma/client";

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
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardListCard key={board.id} board={board} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardListCard({ board }: { board: Board }) {
  return (
    <Link to="/board/$boardId" params={{ boardId: board.id }}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold">{board.name}</h2>
      </div>
    </Link>
  );
}
