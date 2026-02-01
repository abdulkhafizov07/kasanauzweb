import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/profile/_profileLayout/liked-courses",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/profile/_profileLayout/liked-courses"!</div>;
}
