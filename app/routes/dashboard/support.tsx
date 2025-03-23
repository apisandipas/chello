import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/support"!</div>
}
