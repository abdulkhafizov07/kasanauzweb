import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { usersApi } from "@/server";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/web/loader";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  SelectValue,
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import regions from "@/data/regions.json";
import districts from "@/data/districts.json";
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";
import { useNavigate } from "react-router-dom";

export const CreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const formSchema = z
    .object({
      first_name: z.string().min(1),
      last_name: z.string().optional(),
      middle_name: z.string().optional(),
      password: z
        .string()
        .min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak")
        .regex(/[A-Z]/, "Parolda kamida bitta katta harf bo'lishi kerak")
        .regex(/[0-9]/, "Parolda kamida bitta raqam bo'lishi kerak")
        .regex(
          /[^A-Za-z0-9]/,
          "Parolda kamida bitta maxsus belgi bo'lishi kerak"
        ),
      password_confirm: z.string(),
      phone: z.string().optional(),
      region: z.string().optional(),
      district: z.string().optional(),
      birthday: z.string().optional(),
      gender: z.number().nonnegative(),
      email: z.string().email().optional(),
      about: z.string().optional().nullable(),
      biography: z.string().optional().nullable(),
    })
    .refine((data) => data.password === data.password_confirm, {
      path: ["password_confirm"],
      message: "Parollar mos emas",
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      password: "",
      password_confirm: "",
      phone: "",
      region: "",
      district: "",
      birthday: "",
      gender: 0,
      email: "",
      about: "",
      biography: "",
    },
  });
  const regionValue = form.watch("region");

  const showErrorToast = (
    titleKey: string,
    descriptionKey?: string,
    fallback?: string
  ) => {
    toast.error(t(titleKey), {
      description: descriptionKey ? t(descriptionKey) : fallback || "",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const finalValues = {
      ...values,
      region: regions.find((r) => r.id.toString() === values.region)?.name_uz,
      district: districts.find((r) => r.id.toString() === values.district)
        ?.name_uz,
    };

    try {
      const response = await axios.post(
        `${usersApi}dashboard/users/create/`,
        finalValues
      );
      toast.success(t("messages.saved_successfully"));
      if (response.data && response.data.user_guid) {
        navigate(`/admin/users/edit/${response.data.user_guid}`);
      } else {
        navigate(`/admin/users/`);
      }
    } catch (err) {
      showErrorToast("errors.save_failed");
    }
    setLoading(false);
  };

  return (
    <div id="create-user-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">
          {t("admin.pages.create_user")}
        </h3>
      </div>

      <div className="w-full bg-white rounded-lg p-4">
        {loading ? (
          <>
            <div className="py-8">
              <LoadingComponent />
            </div>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-21 lg:grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center justify-center flex-col lg:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("user.first_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("user.last_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("user.middle_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("user.password")}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("user.password_confirm")}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sign-up.phone-number")}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="UZ"
                          countries={["UZ"]}
                          placeholder="95 999 99 99"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.email")}</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.region")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("user.region")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((value) => (
                            <SelectItem value={String(value.id)} key={value.id}>
                              {value.name_uz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.district")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!regionValue}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("user.district")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts
                            .filter((d) => String(d.region_id) === regionValue)
                            .map((d) => (
                              <SelectItem value={String(d.id)} key={d.id}>
                                {d.name_uz}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.birthday")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.gender")}</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(e) => {
                          field.onChange(parseInt(e));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("user.district")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"0"}>Erkak kishi</SelectItem>
                          <SelectItem value={"1"}>Ayol kishi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.about")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="biography"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("user.biography")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="mt-4 cursor-pointer">
                {t("form.save_changes")}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
