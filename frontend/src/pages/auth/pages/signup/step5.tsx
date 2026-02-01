import React, { useEffect, useState } from "react";
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
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { usersApi } from "@/server";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/context/user";

const allPurposes = [
  "Mavzuni o‘rganish",
  "Fikr almashish",
  "Proyekt yaratish",
  "Jamiyat qurish",
];

const schema = z.object({
  purposes: z.array(z.string()).min(1, "Kamida bitta tanlang"),
});

type FormValues = z.infer<typeof schema>;

export const Step5PurposesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const received = location.state;
  const { fetchUser } = useUserContext();

  useEffect(() => {
    if (!received) navigate("/auth/sign-up");
  }, [received, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { purposes: [] },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.put(`${usersApi}accounts/register/step3/`, {
        purposes: values.purposes.join(", ").trim(),
      });
      await fetchUser();
      toast.success("Ro‘yxatdan o‘tdingiz!");
      navigate("/profile/overview/");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-108px)] bg-bg-placeholder">
      <Card className="w-full max-w-5xl shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Platforma maqsadlari</CardTitle>
          <CardDescription>Kamida bittasini tanlang</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="purposes"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-2">
                      {allPurposes.map((purpose) => {
                        const checked = field.value.includes(purpose);
                        return (
                          <FormControl key={purpose}>
                            <div
                              className={cn(
                                "border rounded px-3 py-2 text-center cursor-pointer",
                                checked ? "bg-primary text-white" : "bg-muted"
                              )}
                              onClick={() => {
                                if (checked) {
                                  field.onChange(
                                    field.value.filter((v) => v !== purpose)
                                  );
                                } else {
                                  field.onChange([...field.value, purpose]);
                                }
                              }}
                            >
                              {purpose}
                            </div>
                          </FormControl>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Tugallash
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
