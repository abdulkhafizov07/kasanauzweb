import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslation } from "react-i18next";

// ShadCN UI
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { onlineShopApi } from "@/server";
import { Editor } from "@/components/blocks/editor-00/editor";
import MultiImageUpload from "@/components/ui/multiimage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCategory } from "@/types/onlineshop";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAlertDialog } from "@/hooks/useAlertDialog";

const createProductSchema = z.object({
  name: z.string().min(1, "Maxsulot nomini kiritishingiz kerak"),
  price: z.coerce
    .number({ invalid_type_error: "Narx raqam bo'lishi kerak" })
    .min(0, "Maxsulot narxini belgilashingiz kerak"),
  price_discount: z.coerce
    .number({ invalid_type_error: "Narx raqam bo'lishi kerak" })
    .min(0, "Maxsulot chegirma narxini belgilashingiz kerak")
    .optional()
    .or(z.literal(0)),
  discount: z.coerce
    .number()
    .min(0, "Chegirma 0 dan kam bo'lmasligi kerak")
    .max(100, "Chegirma 100 dan katta bo'lmasligi kerak")
    .optional()
    .or(z.literal(0)),
  short_description: z
    .string()
    .min(1, "Maxsulot haqida qisqacha malumot qoldirishingiz kerak"),
  description: z
    .string()
    .min(1, "Maxsulot haqida to'liq malumot qoldirishingiz kerak"),
  category: z.string().min(1, "Maxsulot kategoriyasini tanlang"),
  images: z
    .any()
    .refine((files: File[]) => files.length > 0 && files.length <= 4, {
      message: "Rasmlar soni 1 dan 4 gacha bo'lishi kerak",
    }),
});

type CreateProductFormType = z.infer<typeof createProductSchema>;

const CreatePage = () => {
  const { t } = useTranslation();
  const alert = useAlertDialog();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [showDiscount, setShowDiscount] = useState(false);

  const form = useForm<CreateProductFormType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      price_discount: 0,
      discount: 0,
      description: "",
      category: "",
      images: [],
    },
  });

  const { watch, handleSubmit } = form;
  const discount = watch("discount");
  const price = watch("price");

  const onSubmit = async (data: CreateProductFormType) => {
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (data.price_discount)
      formData.append("price_discount", data.price_discount.toString());
    formData.append("category", data.category);
    data.images.forEach((img: File) => formData.append("images[]", img));

    try {
      await axios.post(`${onlineShopApi}user-products/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Maxsulot yaratildi!", {
        description: (
          <span className="text-black/40">
            "${data.name}" nomli maxsulot muvaffaqiyatli qo'shildi.
          </span>
        ),
      });

      form.reset();

      alert("Maxsulot yaratildi", {
        description: `"${data.name}" nomli maxsulot muvaffaqiyatli yuklandi. Endi u moderatorlar tomonidan ko'rib chiqiladi.`,
        confirmText: "Tushunarli",
        onConfirm: () => navigate("/profile/products/"),
      });
    } catch (err) {
      alert("Yuklashda xatolik yuz berdi", {
        description:
          "Maxsulot yuklanmadi. Internet aloqangizni tekshiring yoki keyinroq urinib ko'ring.",
        confirmText: "Qayta urinib ko'rish",
        cancelText: "Yopish",
        onConfirm: () => {
          window.location.reload();
        },
      });
    }
  };

  useEffect(() => {
    document.title = "Maxsulot qo'shish - Kasana.UZ";
  }, []);

  useEffect(() => {
    axios.get(`${onlineShopApi}categories/`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">{t("Add product")}</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Product name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Insert name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-4 space-x-4 justify-start items-start">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Price[of]")}</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center mt-8 space-x-2">
              <Switch
                id="discount-switch"
                checked={showDiscount}
                onCheckedChange={setShowDiscount}
              />
              <label htmlFor="discount-switch" className="text-sm">
                Chegirma
              </label>
            </div>

            {showDiscount && (
              <>
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Discount percent")}</FormLabel>
                      <FormControl>
                        <Input type="number" max={100} min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="h-full">
                  <label className="text-sm font-medium">
                    {t("Last price")}
                  </label>
                  <p className="text-md">
                    {discount < 100 && discount > 0
                      ? (price * (1 - discount / 100)).toLocaleString("uz")
                      : ""}
                  </p>
                </div>
              </>
            )}
          </div>

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qisqacha malumot</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("Text")} {...field} />
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
                <FormLabel>To'liq malumot</FormLabel>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Images")}</FormLabel>
                <FormControl>
                  <MultiImageUpload {...field} />
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
                <FormLabel>{t("Category")}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((v, index) => (
                        <>
                          <SelectItem key={index} value={v.guid}>
                            {v.title}
                          </SelectItem>
                        </>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              {t("Cancel")}
            </Button>
            <Button type="submit">{t("Add")}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePage;
