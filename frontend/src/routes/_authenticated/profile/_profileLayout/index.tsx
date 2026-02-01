import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/_profileLayout/")(
    {
        beforeLoad: () => {
            throw redirect({ to: "/profile/overview" });
        },
    }
);
