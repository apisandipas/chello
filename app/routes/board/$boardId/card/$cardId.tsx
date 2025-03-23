import type { ErrorComponentProps } from '@tanstack/react-router';
import { createFileRoute, ErrorComponent, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from "react";
import { getCardFn } from '~/lib/services/cards';
import CardHeader from '~/components/cards/CardHeader';
import CardDescription from '~/components/cards/CardDescription';
import { Button } from '~/components/ui/button';
export const Route = createFileRoute("/board/$boardId/card/$cardId")({
  component: RouteComponent,
  errorComponent: CardErrorComponent,
  loader: async ({ params, context }) => {
    const data = await getCardFn({ data: { id: params.cardId } });
    return { card: data.card, boardId: params.boardId };
  }

});

function RouteComponent() {
  const router = useRouter();
  const { card, boardId } = Route.useLoaderData();

  if (!card) {
    return <div>Card not found</div>;
  }

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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      tabIndex={-1}
      onClick={() => router.navigate({ to: "/board/$boardId", params: { boardId } })}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-row '>
              <CardHeader card={card!} />
              <Link
                to="/board/$boardId"
                params={{ boardId }}
                className="rounded-lg text-gray-500 hover:text-gray-700"
              >
                ✕
              </Link>
            </div>
          </div>
          <div className='flex flex-row gap-4'>
            <div className="space-y-4 flex-1">
              <CardDescription card={card} />
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Actions</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Actions</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Actions</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

function CardErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}