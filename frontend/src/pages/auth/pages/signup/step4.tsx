import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { usersApi } from "@/server";
import { toast } from "sonner";
import { t } from "i18next";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const schema = z.object({
  about: z.string().min(1, "Qisqacha tanishtiring"),
  biography: z.string().min(1, "To‘liq bio kiriting"),
});

type FormValues = z.infer<typeof schema>;

export const Step4ProfileInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const received = location.state;

  useEffect(() => {
    if (!received) navigate("/auth/sign-up");
  }, [received, navigate]);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const payload = { ...received, ...values };
    try {
      await axios.put(`${usersApi}accounts/register/step3/`, values);
      navigate("/auth/sign-up/step5/", { state: payload });
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-108px)] bg-bg-placeholder">
      <Card className="w-full max-w-5xl shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ish va maqsad haqida</CardTitle>
          <CardDescription>
            Yaxshiroq tajriba uchun profilingizni to‘liq to‘ldiring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-start justify-between space-x-4">
                <FormField
                  control={form.control}
                  name={"about"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t(`user.about`)}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"biography"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t(`user.biography`)}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => {
                    navigate("/auth/sign-up/step3", { state: received });
                  }}
                >
                  <span className="icon">
                    <ArrowLeftIcon />
                  </span>
                  <span className="text">Ortga</span>
                </Button>
                <Button type="submit">
                  <span className="text">Keyingi</span>
                  <span className="icon">
                    <ArrowRightIcon />
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
