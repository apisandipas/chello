import type { ErrorComponentProps } from '@tanstack/react-router';
import { createFileRoute, ErrorComponent, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from "react";
import { getCardFn } from '~/lib/services/cards';

export const Route = createFileRoute("/board/$boardId/card/$cardId")({
  component: RouteComponent,
  errorComponent: CardErrorComponent,
  loader: async ({ params }) => {
    const { card } = await getCardFn({ data: { id: params.cardId } });
    return { card, boardId: params.boardId };
  }

});

function RouteComponent() {
  const router = useRouter();

  const { card, boardId } = Route.useLoaderData();
  console.log(card);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.navigate({ to: "/board/$boardId", params: { boardId } });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [boardId, router]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" tabIndex={-1}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Card Details</h2>
          <Link
            to="/board/$boardId"
            params={{ boardId }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Link>
        </div>

        <div className="space-y-4">
          <p>Card ID: {card?.id}</p>
          <p>Board ID: {boardId}</p>
          <p>Card Name: {card?.name}</p>
        </div>
      </div>
    </div>
  );
}

function CardErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}