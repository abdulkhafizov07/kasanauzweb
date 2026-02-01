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
import { onlineShopApi } from "@/server";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/web/loader";
import { Editor } from "@/components/blocks/editor-00/editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  { id: "f4f6aae0-a24c-4c22-be2e-73bb97cb67f7", name: "Electronics" },
  { id: "aaa-bbb-ccc", name: "Furniture" },
];

export const EditPage: React.FC = () => {
  const { t } = useTranslation();
  const { guid } = useParams();

  const [loading, setLoading] = useState<boolean>(true);

  const formSchema = z.object({
    title: z.string().min(1),
    meta: z.string().optional(),
    short_description: z.string().optional(),
    description: z.string().optional(),
    category: z.string().uuid(),
    price: z.string().min(1),
    price_discount: z.string().nullable().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      meta: "",
      short_description: "",
      description: "",
      category: "",
      price: "",
      price_discount: null,
    },
  });

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
      const res = await axios.get(`${onlineShopApi}dashboard/product/${guid}/`);
      const product = res.data;

      Object.keys(formSchema.shape).forEach((key) => {
        setValue(key as keyof FormValues, product[key] ?? "");
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

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.put(`${onlineShopApi}dashboard/product/${guid}/`, values);
      toast.success(t("messages.saved_successfully"));
    } catch (err) {
      showErrorToast("errors.save_failed");
    }
  };

  useEffect(() => {
    if (guid) fetchData();
  }, [guid]);

  return (
    <div id="edit-product-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">
          {t("admin.pages.edit_product")}
        </h3>
      </div>

      <div className="w-full bg-white rounded-lg p-4">
        {loading ? (
          <div className="py-8">
            <LoadingComponent />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 space-x-3 space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product.title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product.category")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("product.select_category")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem value={c.id} key={c.id}>
                              {c.name}
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
                  name="meta"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("product.meta")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product.price")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("product.price_discount")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>{t("product.short_description")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>{t("product.description")}</FormLabel>
                        <FormControl>
                          <Editor {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit">{t("form.save_changes")}</Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
