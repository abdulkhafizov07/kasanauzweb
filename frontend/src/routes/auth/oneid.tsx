import { createFileRoute } from "@tanstack/react-router";
import LoadingComponent from "@/components/web/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { cn } from "@/lib/utils";
import { useRouter, useSearch } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/oneid")({
  component: RouteComponent,
});

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface ErrorResponse {
  message: string;
}

function RouteComponent() {
  const router = useRouter();
  const search = useSearch({ from: "/auth/oneid" });
  const alert = useAlertDialog();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = search.code as string | undefined;

    if (!code) {
      router.navigate({ to: "/auth/login" });
      return;
    }

    const loginWithOneId = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/api/auth/oneid/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            (data as ErrorResponse).message || "OneID login failed",
          );
        }

        const { access_token, refresh_token } = data as TokenResponse;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        setTimeout(() => {
          toast.success("Muaffaqiyatli login", {
            description: (
              <span className="text-black/40">
                OneID orqali muvaffaqiyatli kirildi.
              </span>
            ),
          });

          router.navigate({
            to: "/profile/overview",
            reloadDocument: true,
          });
        }, 500);
      } catch (err: any) {
        alert("Xatolik yuz berdi", {
          description: err.message || "OneID login muammo yuz berdi.",
          confirmText: "Tushunarli",
          onConfirm: () => router.navigate({ to: "/auth/login" }),
        });
      } finally {
        setLoading(false);
      }
    };

    loginWithOneId();
  }, [search.code]);

  return (
    <div
      id="complete"
      className="w-full h-[calc(100vh-108px)] bg-bg-placeholder flex items-center justify-center"
    >
      <Card className={cn("shadow-none p-0 py-4")}>
        <CardHeader>
          <CardTitle className="text-center text-2xl">ONEID</CardTitle>
        </CardHeader>
        <CardContent className="px-12 py-8">
          {loading ? (
            <>
              <LoadingComponent />
              <p className="text-description font-normal text-center mt-8">
                One ID tizimi orqali kirish amalga oshirilmoqda...
              </p>
            </>
          ) : (
            <p className="text-description font-normal text-center mt-8">
              Jarayonni kuting...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
