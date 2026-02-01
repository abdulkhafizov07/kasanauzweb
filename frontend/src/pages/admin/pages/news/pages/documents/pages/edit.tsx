import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { onlineShopApi } from "@/server";
import { ProductCategoryAdminColumnType } from "@/types/admin/onlineshop";

const schema = z.object({
  title: z.string().min(2, "Kamida 2 ta belgidan iborat bo‘lishi kerak"),
});

type FormValues = z.infer<typeof schema>;

interface EditCategoryProps {
  open: boolean;
  onClose: () => void;
  category: ProductCategoryAdminColumnType | null;
  refresh: () => void;
}

export const EditCategory: React.FC<EditCategoryProps> = ({
  open,
  onClose,
  category,
  refresh,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.onlineshop" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: category?.title || "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({ title: category.title });
    }
  }, [category, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!category) return;

    try {
      await axios.put(
        `${onlineShopApi}dashboard/category/edit/${category.guid}/`,
        data
      );
      toast.success(t("edit_success") || "Kategoriya yangilandi ✅");
      refresh();
      onClose();
    } catch (error) {
      console.error("Edit failed", error);
      toast.error(
        t("edit_failed") ||
          "Kategoriya yangilanmadi. Qaytadan urinib ko‘ring. ❌"
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>{t("edit_category")}</SheetTitle>
          <SheetDescription>{category?.title}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 p-3">
          <div>
            <Input
              {...register("title")}
              placeholder={t("category_title") || "Toifa nomi"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
            </SheetClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") || "Saqlanmoqda..." : t("save")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
