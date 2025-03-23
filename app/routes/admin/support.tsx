import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/support"!</div>
}
