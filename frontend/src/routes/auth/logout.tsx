import { useAuth } from "@/context/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/logout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    navigate({
      to: "/auth/login",
    });
  }, []);

  return <div>Hello "/auth/logout"!</div>;
}
