// NewsCreatePage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Editor } from "@/components/blocks/editor-00/editor";
import { newsApi } from "@/server";
import { NewsCategory } from "@/types/news";
import { useTranslation } from "react-i18next";

const schema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  thumbnail: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Max 5MB ruxsat etiladi",
  }),
  short_description: z.string().min(1).max(250),
  description: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState<NewsCategory[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      title: "",
      short_description: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail);

    try {
      await axios.post(`${newsApi}dashboard/news/create/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Yangilik muvaffaqiyatli yaratildi");
      navigate("/admin/news");
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  useEffect(() => {
    axios.get(`${newsApi}categories/`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">
          {t("admin.pages.create_news")}
        </h3>
      </div>

      <div className="w-full bg-white rounded-lg p-4 mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoriya</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c, i) => (
                            <SelectItem key={i} value={String(c.guid)}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="thumbnail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rasm</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Sarlavha</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarlavha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="short_description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Qisqacha tavsif</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Batafsil tavsif</FormLabel>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Yaratish</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
