import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { usersApi } from "@/server";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/context/user";

const schema = z.object({
  code: z
    .string()
    .min(5, "Kod 5 xonali bo'lishi kerak")
    .max(5, "Kod 5 xonali bo'lishi kerak")
    .regex(/^\d+$/, "Kod faqat raqamlardan iborat bo'lishi kerak"),
});

type FormValues = z.infer<typeof schema>;

export const SignUpOtpVerifyPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone;

  const [codeInvalidError, setCodeInvalidError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post(`${usersApi}accounts/register/step2/`, {
        phone: phone,
        code: values.code,
      });
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      toast.success(t("sign-up.code_verified"));
      navigate("/auth/sign-up/step3/", {
        state: { ...location.state, code: values.code },
      });
    } catch (err) {
      setCodeInvalidError(true);
      toast.error(t("errors.verification_failed"), {
        description: t("form.errors.invalid_code"),
      });
    }
  };

  useEffect(() => {
    if (!phone) {
      navigate("/auth/sign-up");
    }
  }, [phone]);

  useEffect(() => {
    document.title = `${t("sign-up.verify_code")} - Kasana.UZ`;
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-108px)] bg-bg-placeholder">
      <Card className={cn("shadow-none border-none w-full max-w-sm")}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("sign-up.verify_code")}</CardTitle>
          <CardDescription>
            {t("sign-up.enter_code_sent_to_phone", {
              phone,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="mx-auto w-min">
                    <FormControl>
                      <InputOTP
                        maxLength={5}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t("sign-up.verify")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={codeInvalidError} onOpenChange={setCodeInvalidError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("errors.verification_failed")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("form.errors.invalid_code")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yopish</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
