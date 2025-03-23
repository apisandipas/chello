import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/accounting"!</div>
}
