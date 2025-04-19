import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/shemoard")({
  component: () => <Outlet />,
  beforeLoad: ({ context }: { context: { user?: unknown } }) => {
    console.log("[shemoard] Context:", context);
    if (!context.user) {
      return redirect({
        to: "/auth/login",
        statusCode: 301,
      });
    }
    return {
      user: context.user,
    };
  },
});
