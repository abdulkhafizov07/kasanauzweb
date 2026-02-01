import { useRouterState } from "@tanstack/react-router";
import LoadingComponent from "./loader";

export default function GlobalLoader() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  });
  return isLoading ? (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white z-99">
      <LoadingComponent />
    </div>
  ) : null;
}
