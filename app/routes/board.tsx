import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/board')({
  component: () => <Outlet />,
  beforeLoad: ({ context }: { context: { user?: unknown } }) => {
    if (!context.user) {
      return redirect({
        to: '/auth/login',
        statusCode: 301,
      });
    }
    return {
      user: context.user,
    }
  },
})

