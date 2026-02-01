import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/announcements/work')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/announcements/work"!</div>
}
