import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/accounting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/accounting"!</div>
}
