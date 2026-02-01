import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/category/$meta")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/courses/category/$meta"!</div>;
}
