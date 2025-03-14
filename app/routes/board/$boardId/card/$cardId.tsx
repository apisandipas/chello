import { createFileRoute, useParams, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/board/$boardId/card/$cardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId, cardId } = useParams({
    from: "/board/$boardId/card/$cardId",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
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
          <p>Card ID: {cardId}</p>
          <p>Board ID: {boardId}</p>
          {/* Add more card details here */}
        </div>
      </div>
    </div>
  );
}
