import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Editor } from "@/components/blocks/editor-00/editor";
import { coursesApi } from "@/server";
import { CourseCategory } from "@/types/courses";
import { convertToYouTubeEmbed } from "@/utils";
import { cn } from "@/lib/utils";
import { useAlertDialog } from "@/hooks/useAlertDialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const lessonSchema = z.object({
  order: z.coerce.number().min(1),
  video: z.string().url("To‘g‘ri video havolasini kiriting"),
});

const schema = z.object({
  category: z.string().min(1, "Kategoriya tanlang"),
  title: z.string().min(1, "Sarlavhani kiriting"),
  short_description: z
    .string()
    .min(1, "Qisqa ma’lumot kiriting")
    .max(250, "250 belgidan oshmasligi kerak"),
  description: z.string().min(1, "To‘liq ma’lumotni kiriting"),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Fayl hajmi 5MB dan oshmasligi kerak",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "JPEG, PNG yoki WebP fayl yuklang",
    }),

  lessons: z.array(lessonSchema).min(1, "Kamida bitta dars qo‘shing"),
});

type FormValues = z.infer<typeof schema>;

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const alert = useAlertDialog();

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [tab, setTab] = useState("main");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      thumbnail: undefined,
      short_description: "",
      description: "",
      lessons: [{ order: 1, video: "" }],
    },
  });

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({ control: form.control, name: "lessons" });
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    const coursePayload = {
      category: data.category,
      title: data.title,
      short_description: data.short_description,
      description: data.description,
    };

    formData.append("course", JSON.stringify(coursePayload));
    formData.append("lessons", JSON.stringify(data.lessons));
    formData.append("thumbnail", data.thumbnail as File);

    try {
      const response = await axios.post(
        `${coursesApi}dashboard/courses/create/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Kurs yaratildi!");
      navigate(`/admin/courses/courses/${response.data.course_guid}`);
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      let title = "Yuklashda xatolik yuz berdi";
      let description =
        "Kursni yaratish vaqtida xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";

      if (status === 400) {
        description =
          detail ||
          "Kiritilgan ma'lumotlarda xatolik bor. Iltimos, tekshirib qayta urinib ko‘ring.";
      } else if (status === 403) {
        description = "Sizda bu amalni bajarishga ruxsat yo‘q.";
      } else if (status === 404) {
        description = "So‘ralgan resurs topilmadi.";
      } else if (status === 413) {
        description = "Yuklangan fayl juda katta. Maksimal hajm: 5MB.";
      } else if (status === 500) {
        description =
          "Serverda ichki xatolik yuz berdi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.";
      }

      alert(title, {
        description,
        confirmText: "Tushunarli",
        onConfirm: () => {},
      });

      toast.error("Kurs yaratishda xatolik yuz berdi");
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = "Kurs qo'shish - Admin - Kasana.UZ";
  }, []);

  useEffect(() => {
    axios.get(`${coursesApi}categories/`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">Kurs yaratish</h3>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center justify-start">
              <Button
                className={cn(
                  "bg-transparent border-0 border-b-2 " +
                    (tab === "main"
                      ? "border-brand rounded-none text-brand hover:bg-brand/15"
                      : "border-black/40 rounded-none text-black/40 hover:bg-muted")
                )}
                type="button"
                onClick={() => setTab("main")}
              >
                Asosiy malumotlar
              </Button>
              <Button
                className={cn(
                  "bg-transparent border-0 border-b-2 " +
                    (tab === "lessons"
                      ? "border-brand rounded-none text-brand hover:bg-brand/15"
                      : "border-black/20 rounded-none text-black/40 hover:bg-muted")
                )}
                type="button"
                onClick={() => setTab("lessons")}
              >
                Darslar
              </Button>
              <div className="w-full h-11 border-b-2 border-black/20"></div>
            </div>

            <div
              className={"space-y-4 " + (tab === "main" ? "visible" : "hidden")}
            >
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoriya</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat, index) => (
                          <SelectItem key={index} value={String(cat.guid)}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-start justify-start space-x-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormLabel>Sarlavha</FormLabel>
                      <FormControl>
                        <Input placeholder="Kurs nomi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>Rasm yuklang</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qisqa ma’lumot</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To‘liq ma’lumot</FormLabel>
                    <Editor value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className={
                "space-y-4 " + (tab === "lessons" ? "visible" : "hidden")
              }
            >
              {[...lessonFields].map((field, index) => (
                <div key={index}>
                  <div className="w-full flex items-start justify-center space-x-4">
                    <FormField
                      control={form.control}
                      name={`lessons.${index}.order`}
                      disabled
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Dars tartibi</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`lessons.${index}.video`}
                      render={({ field: { onChange, ...rest } }) => (
                        <FormItem className="w-full">
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/..."
                              {...rest}
                              onChange={(e) => {
                                const embedUrl = convertToYouTubeEmbed(
                                  e.target.value
                                );
                                onChange(embedUrl || e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className="mt-5"
                      onClick={() => removeLesson(index)}
                    >
                      O‘chirish
                    </Button>
                  </div>

                  {lessonFields[index] && lessonFields[index].video ? (
                    <div className="aspect-[16/9] mt-4 w-full max-w-md">
                      <iframe
                        src={lessonFields[index].video}
                        className="w-full h-full object-cover"
                      ></iframe>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendLesson({ order: lessonFields.length + 1, video: "" })
                }
              >
                Dars qo‘shish
              </Button>
            </div>

            <Button type="submit" className="mt-4">
              Kursni yaratish
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
