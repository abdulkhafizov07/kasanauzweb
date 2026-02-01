import LoadingComponent from "@/components/web/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/user";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { cn } from "@/lib/utils";
import { usersApi } from "@/server";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const OneIdPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alert = useAlertDialog();
  const { fetchUser } = useUserContext();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      axios
        .post(`${usersApi}accounts/oneid/`, { code })
        .then((response) => {
          if (response.data.access && response.data.refresh) {
            window.localStorage.setItem("access", response.data.access);
            window.localStorage.setItem("refresh", response.data.refresh);

            toast.success("Muaffaqiyatli login", {
              description: (
                <span className="text-black/40">
                  OneID orqali muvaffaqiyatli kirildi.
                </span>
              ),
            });

            fetchUser();

            // Redirect user to profile overview
            navigate("/profile/overview/");
          } else {
            alert("Login muvaffaqiyatsiz", {
              description:
                "OneID platformasidan login ma'lumotlarini olishda muammo yuz berdi.",
            });
          }
        })
        .catch((error) => {
          console.error("One ID login error:", error);
          alert("Xatolik yuz berdi", {
            description:
              "OneID platformasidan login ma'lumotlarini olishda muammo yuz berdi.",
            confirmText: "Tushunarli",
            onConfirm: () => navigate("/auth/sign-in/"),
          });
        });
    } else {
      navigate("/auth/sign-in/");
    }
  }, []);

  return (
    <div
      id="complete"
      className={
        "w-full h-[calc(100vh-108px)] bg-bg-placeholder flex items-center justify-center"
      }
    >
      <Card className={cn("shadow-none p-0 py-4")}>
        <CardHeader>
          <CardTitle className={cn("text-center text-2xl")}>ONEID</CardTitle>
        </CardHeader>
        <CardContent className={"px-12 py-8"}>
          <LoadingComponent />

          <p className="text-description font-normal text-center mt-8">
            One ID tizimi orqali kirish amalga oshirilmoqda...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
