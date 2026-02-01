// CreateAnnouncementPage.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

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

import { announcementsApi } from "@/server";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import regions from "@/data/regions.json";
import districts from "@/data/districts.json";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/blocks/editor-00/editor";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const schema = z.object({
  announcement_type: z.enum(["service_announcement", "work_announcement"]),
  name: z.string().min(1, "Nomni kiriting"),
  thumbnail: z
    .instanceof(File)
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Fayl hajmi 5MB dan oshmasligi kerak",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Faqat JPEG, PNG yoki WebP fayl yuklang",
    }),
  price_min: z.coerce.number().min(0, "Narx manfiy bo'lmasligi kerak"),
  price_max: z.coerce.number().min(0, "Narx manfiy bo'lmasligi kerak"),
  negotiate: z.boolean(),
  region: z.coerce.number().min(1, "Hududni tanlang"),
  district: z.coerce.number().min(1, "Tuman yoki shaharni tanlang"),
  address: z.string().min(1, "Manzilni kiriting"),
  experience: z.string().optional(),
  work_time: z.string().optional(),
  description: z.string().min(1, "To'liq ma’lumotni kiriting"),
  short_description: z
    .string()
    .min(1, "Qisqacha malumotni kiritnig")
    .max(150, "Belgilar soni tugadi"),
});

type FormValues = z.infer<typeof schema>;

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { type } = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      announcement_type:
        type === "service" ? "service_announcement" : "work_announcement",
      name: "",
      price_min: 0,
      price_max: 0,
      negotiate: false,
      region: 2,
      district: 16,
      address: "",
      experience: "",
      work_time: "full_time",
      short_description: "",
      description: "",
    },
  });

  const negotiate = form.watch("negotiate");

  const onSubmit = async (data: FormValues) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", data.name);
    formDataToSend.append("price_min", data.price_min.toString());
    formDataToSend.append("price_max", data.price_max.toString());
    formDataToSend.append("dealed", data.negotiate.toString());
    formDataToSend.append(
      "region",
      regions.find((v) => Number(v.id) === Number(data.region))?.name_uz || ""
    );
    formDataToSend.append(
      "district",
      districts.find((v) => Number(v.id) === Number(data.district))?.name_uz ||
        ""
    );
    formDataToSend.append("address", data.address);
    formDataToSend.append("experience", data.experience || "");
    formDataToSend.append("work_time", data.work_time || "");
    formDataToSend.append("short_description", data.short_description);
    formDataToSend.append("description", data.description);
    formDataToSend.append("announcement_type", data.announcement_type);

    if (data.thumbnail) formDataToSend.append("thumbnail", data.thumbnail);

    try {
      const response = await axios.post(
        `${announcementsApi}dashboard/announcements/create/`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Elon joylandi");
      if (response.data && response.data.announcement_guid) {
        navigate(
          `/admin/announcements/${type}/edit/${response.data.announcement_guid}`
        );
      } else {
        navigate(`/admin/announcements/${type}`);
      }
    } catch (err) {
      toast.success("Xatolik");
    }
  };

  return (
    <div id="create-announcement-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">
          {t("admin.pages.create_announcement")}
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
              <span></span>
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

            <Button type="submit">Yaratish</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
