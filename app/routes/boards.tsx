import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { BoardListCard } from "~/components/boards/BoardListCard";
import { CreateBoardButton } from "~/components/boards/CreateBoardButton";
import { getCurrentUser } from "~/lib/services/auth";
import { getBoardsFn } from "~/lib/services/boards";
import { BoardWithCounts } from "~/types";

const boardSearchSchema = z.object({
  showArchived: z.boolean().optional().catch(false),
})


export const Route = createFileRoute("/boards")({
  component: RouteComponent,
  validateSearch: boardSearchSchema,
  loaderDeps: ({ search }) => {
    return {
      showArchived: search.showArchived,
    }
  },
  beforeLoad: ({ context, search }) => {
    if (!context.user) {
      throw redirect({
        to: '/auth/login',
        statusCode: 301,
      });
    }
    return {
      user: context.user,
      showArchived: search.showArchived,
    }
  },
  loader: async ({ params, deps }) => {
    const user = await getCurrentUser();
    if (!user) {
      await redirect({
        to: '/auth/login',
        statusCode: 301,
      });
      return { boards: [] }
    }
    const boards = await getBoardsFn({
      data: { userId: user.id, showArchived: deps.showArchived ?? false }
    });
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
  const { showArchived } = Route.useSearch();


  if (!boards || boards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className=" flex p-4 items-center">
        <h1 className="text-2xl font-bold mb-4">Boards</h1>
        <div className="text-sm text-gray-500 ml-auto">
          <Link from='/boards' to='.' search={{ showArchived: !showArchived }}>
            {showArchived ? 'Hide Archived' : 'View Archived'}
          </Link>
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardListCard key={board.id} showArchived={showArchived ?? false} board={board as unknown as BoardWithCounts} />
          ))}
        </div>
      </div>
    </div>
  );
}

