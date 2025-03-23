import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/teams')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/teams"!</div>
}
