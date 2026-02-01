import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { newsApi } from "@/server";

const schema = z.object({
  doc_type: z.enum(["legacy_documents", "bussinies_documents"], {
    required_error: "Hujjat turi tanlanishi kerak",
  }),
  title: z
    .string()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo‘lishi kerak"),
  subtitle: z.string().optional(),
  link: z
    .union([z.literal(""), z.string().url("To‘g‘ri URL kiriting")])
    .optional(),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

export const CreatePage: React.FC<CreateDocumentDialogProps> = ({
  open,
  onClose,
  refresh,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.news" });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doc_type: "bussinies_documents",
      title: "",
      subtitle: "",
      link: "",
      file: undefined,
    },
  });

  const docType = form.watch("doc_type");

  useEffect(() => {
    if (open) form.reset();
  }, [open, form]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("doc_type", data.doc_type);
    formData.append("title", data.title);

    if (data.subtitle) formData.append("subtitle", data.subtitle);
    if (data.link) formData.append("link", data.link);
    if (data.file) formData.append("file", data.file);

    try {
      await axios.post(`${newsApi}dashboard/documents/create/`, formData);
      toast.success(t("create_success") || "Hujjat yaratildi 🎉");
      refresh();
      onClose();
    } catch (err) {
      console.error("Create document failed:", err);
      toast.error(t("create_failed") || "Yaratishda xatolik yuz berdi ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("create_document")}</DialogTitle>
          <DialogDescription>{t("create_document_desc")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doc_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("doc_type") || "Hujjat turi"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select_doc_type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="legacy_documents">
                        Qonunchilik hujjatlari
                      </SelectItem>
                      <SelectItem value="bussinies_documents">
                        Kichik biznes loyihalar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("document_title") || "Sarlavha"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Hujjat nomi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("document_subtitle") || "Qo‘shimcha sarlavha"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ixtiyoriy" />
                  </FormControl>
                </FormItem>
              )}
            />

            {docType === "legacy_documents" && (
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("document_link") || "Havola"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {docType === "bussinies_documents" && (
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>
                      {t("document_file") || "Fayl yuklash"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.ppt"
                        onChange={(e) =>
                          onChange(
                            e.target.files ? e.target.files[0] : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("cancel") || "Bekor qilish"}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("saving") || "Yaratilmoqda..."
                  : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
