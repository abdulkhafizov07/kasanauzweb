// EditAnnouncementPage.tsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import regions from "@/data/regions.json";
import districts from "@/data/districts.json";
import { announcementsApi } from "@/server";
import { Editor } from "@/components/blocks/editor-00/editor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const schema = z.object({
  announcement_type: z.enum(["service_announcement", "work_announcement"]),
  name: z.string().min(1, "Nomni kiriting"),
  meta: z.string().min(1, "Meta kiriting"),
  thumbnail: z.any().optional(),
  price_min: z.coerce.number(),
  price_max: z.coerce.number(),
  negotiate: z.boolean(),
  region: z.coerce.number(),
  district: z.coerce.number(),
  address: z.string(),
  experience: z.string().optional(),
  work_time: z.string().optional(),
  description: z.string(),
  short_description: z.string(),
});

type FormValues = z.infer<typeof schema>;

export const EditPage: React.FC = () => {
  const { announcement_guid, type } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      announcement_type: "service_announcement",
      name: "",
      meta: "",
      price_min: 0,
      price_max: 0,
      negotiate: false,
      region: 0,
      district: 0,
      address: "",
      experience: "",
      work_time: "",
      description: "",
      short_description: "",
    },
  });

  const negotiate = form.watch("negotiate");

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${announcementsApi}dashboard/announcement/${announcement_guid}/`
        );
        const data = res.data;

        form.reset({
          announcement_type: data.announcement_type,
          name: data.title,
          meta: data.meta,
          price_min: data.price_min,
          price_max: data.price_max,
          negotiate: data.dealed,
          region: regions.find((v) => v.name_uz === data.region)?.id,
          district: districts.find((v) => v.name_uz === data.district)?.id,
          address: data.address,
          experience: data.experience,
          work_time: data.work_time,
          description: data.description,
          short_description: data.short_description,
        });
      } catch (err) {
        toast.error("E'lon ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [announcement_guid, form]);

  // Submit
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("meta", data.meta);
    formData.append("price_min", data.price_min.toString());
    formData.append("price_max", data.price_max.toString());
    formData.append("dealed", data.negotiate.toString());
    formData.append(
      "region",
      regions.find((v) => Number(v.id) === Number(data.region))?.name_uz || ""
    );
    formData.append(
      "district",
      districts.find((v) => Number(v.id) === Number(data.district))?.name_uz ||
        ""
    );
    formData.append("address", data.address);
    formData.append("experience", data.experience || "");
    formData.append("work_time", data.work_time || "");
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("announcement_type", data.announcement_type);

    if (data.thumbnail && data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    try {
      await axios.put(
        `${announcementsApi}dashboard/announcement/${announcement_guid}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("E'lon yangilandi");
      navigate(`/admin/announcements/${type}`);
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div id="edit-announcement-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">
          {t("admin.pages.edit_announcement")}
        </h3>
      </div>

      <div className="w-full bg-white rounded-lg p-4 mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 space-x-4">
              <FormField
                name="announcement_type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tur</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service_announcement">
                            Xizmat e'loni
                          </SelectItem>
                          <SelectItem value="work_announcement">
                            Ish e'loni
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="meta"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 space-x-4 items-start justify-start">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sarlavha</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
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

            <div className="grid grid-cols-3 space-x-4 items-start justify-start">
              <FormField
                control={form.control}
                name="price_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimal narx</FormLabel>

                    {negotiate ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <FormControl>
                              <Input type="number" {...field} disabled />
                            </FormControl>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Narxlarni belgilash uchun <b>Kelishiladi</b>ni
                            o‘chirib qo‘ying
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksimal narx</FormLabel>

                    {negotiate ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <FormControl>
                              <Input type="number" {...field} disabled />
                            </FormControl>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Narxlarni belgilash uchun <b>Kelishiladi</b>ni
                            o‘chirib qo‘ying
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negotiate"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 mt-8.5">
                    <FormLabel>Kelishiladi</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 space-x-4 items-start justify-start">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viloyat / Hudud</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          form.setValue("district", 0);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                              {r.name_uz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuman / Shahar</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts
                            .filter((d) => d.region_id === form.watch("region"))
                            .map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.name_uz}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 space-x-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tajriba</FormLabel>
                    <FormControl>
                      <Input placeholder="2yil, 4yil+ va hokazo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E’lon turi</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={cn("w-full")}>
                          <SelectValue placeholder="E’lon turi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">
                            To'liq ish vaqti
                          </SelectItem>
                          <SelectItem value="part_time">
                            Yarim ish vaqti
                          </SelectItem>
                          <SelectItem value="flexable_time">
                            Moslashuvchan ish vaqti
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="short_description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Batafsil tavsif</FormLabel>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Yangilash</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
