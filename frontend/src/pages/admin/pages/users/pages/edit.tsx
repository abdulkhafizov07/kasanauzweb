import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
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

export const EditPage: React.FC = () => {
  const { t } = useTranslation();
  const { guid } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const formSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().optional(),
    phone: z.string().optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    birthday: z.string().optional(),
    gender: z.number().nonnegative(),
    email: z.string().email().optional(),
    about: z.string().optional().nullable(),
    biography: z.string().optional().nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
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

  const { setValue } = form;

  const showErrorToast = (
    titleKey: string,
    descriptionKey?: string,
    fallback?: string
  ) => {
    toast.error(t(titleKey), {
      description: descriptionKey ? t(descriptionKey) : fallback || "",
    });
  };

  const fetchData = async () => {
    if (!guid) return;

    setLoading(true);

    try {
      const res = await axios.get(`${usersApi}dashboard/users/${guid}/`);
      const user = res.data;

      Object.keys(formSchema.shape).forEach((key) => {
        if (key === "phone") {
          setValue(
            key as keyof typeof formSchema.shape,
            "+998" + String(user[key])
          );
        } else if (key === "region") {
          setValue(
            key as keyof typeof formSchema.shape,
            regions
              .find((v) => v.name_uz.toString() === user[key])
              ?.id.toString() ?? ""
          );
        } else if (key === "district") {
          setValue(
            key as keyof typeof formSchema.shape,
            districts
              .find((v) => v.name_uz.toString() === user[key])
              ?.id.toString() ?? ""
          );
        } else {
          setValue(key as keyof typeof formSchema.shape, user[key] ?? "");
        }
      });
    } catch (err: any) {
      const method = String(err.config?.method || "").toUpperCase();
      if (method === "OPTIONS") return;

      if (err.code === "ERR_NETWORK") {
        showErrorToast("errors.network_error", "errors.fetch_failed");
      } else if (err.response?.status === 404) {
        showErrorToast("errors.not_found_error");
      } else {
        showErrorToast("errors.server_error");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const finalValues = {
      ...values,
      region: regions.find((r) => r.id.toString() === values.region)?.name_uz,
      district: districts.find((r) => r.id.toString() === values.district)
        ?.name_uz,
    };

    try {
      await axios.put(`${usersApi}dashboard/users/${guid}/`, finalValues);
      toast.success(t("messages.saved_successfully"));
    } catch (err) {
      showErrorToast("errors.save_failed");
    }
  };

  useEffect(() => {
    if (guid) fetchData();
  }, [guid]);

  return (
    <div id="edit-user-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">{t("admin.pages.edit_user")}</h3>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sign-up.phone-number")}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="UZ"
                          countries={["UZ"]}
                          placeholder="95 999 99 99"
                          disabled
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
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          rows={6}
                        />
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
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          rows={6}
                        />
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
