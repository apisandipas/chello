import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getBoardsFn } from "~/lib/services/boards";
import type { Board } from "@prisma/client";
import { getCurrentUser } from "~/lib/services/auth";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateBoardButton } from "~/components/boards/CreateBoardButton";

type BoardWithCounts = Board & {
  _count: {
    columns: number;
    cards: number;
  };
};

export const Route = createFileRoute("/boards")({
  component: RouteComponent,
  beforeLoad: ({ context }: { context: { user?: unknown } }) => {
    console.log('boards route - beforeload', { context })
    if (!context.user) {
      // Redirect to the home page if the user is not authenticated
      return redirect({
        to: '/auth/login',
        statusCode: 301,
      });

    }
    return {
      user: context.user,
    }
  },
  loader: async () => {
    const user = await getCurrentUser();
    if (!user) {
      await redirect({
        to: '/auth/login',
        statusCode: 301,
      });
      return { boards: [] }
    }
    const boards = await getBoardsFn({ data: { userId: user.id } });
    return { boards };
  },
});

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="mb-6">
        <img src="/chello.svg" alt="Chello" className="w-16 h-16 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No boards yet</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Get started by creating your first board. Boards help you organize your work and collaborate with others.
      </p>
      <CreateBoardButton />
    </div>
  );
}

function RouteComponent() {
  const { boards } = Route.useLoaderData();

  if (!boards || boards.length === 0) {
    return <EmptyState />;
  }

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
