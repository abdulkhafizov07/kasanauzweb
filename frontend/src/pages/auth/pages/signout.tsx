import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import LoadingComponent from "@/components/web/loader";
import { useUserContext } from "@/context/user";
import { useNavigate } from "react-router-dom";

export const SignOutPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      logout().then(() => {
        navigate("/auth/sign-in", { replace: true });
      });
    }, 400);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-bg-placeholder">
      <Card className="shadow-none border-none bg-white w-96">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t("sign-out.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("sign-out.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12">
            <LoadingComponent />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
