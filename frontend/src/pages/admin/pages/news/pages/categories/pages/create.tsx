import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
import { newsApi } from "@/server";

const schema = z.object({
  title: z.string().min(2, "Kamida 2 ta belgidan iborat bo‘lishi kerak"),
});

type FormValues = z.infer<typeof schema>;

interface CreateCategoryProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

export const CreateCategory: React.FC<CreateCategoryProps> = ({
  open,
  onClose,
  refresh,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.news" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post(`${newsApi}dashboard/categories/create/`, data);
      toast.success(t("create_success") || "Toifa yaratildi 🎉");
      refresh();
      onClose();
    } catch (err) {
      console.error("Create failed", err);
      toast.error(t("create_failed") || "Yaratishda xatolik yuz berdi ❌");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>{t("create_category")}</SheetTitle>
          <SheetDescription>
            {t("create_category_desc") || "Yangi toifa nomini kiriting"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 px-3">
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
                {t("cancel") || "Bekor qilish"}
              </Button>
            </SheetClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") || "Yaratilmoqda..." : t("create")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
