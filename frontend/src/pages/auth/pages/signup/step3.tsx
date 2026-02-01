import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usersApi } from "@/server";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { normalizeDate } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import regions from "@/data/regions.json";
import districts from "@/data/districts.json";

const today = new Date();
const minDate = new Date(today.getFullYear() - 120, 0, 1);

const schema = z.object({
  first_name: z.string().min(1, "Ism kiriting"),
  last_name: z.string().min(1, "Familiya kiriting"),
  email: z.string().email("Email noto‘g‘ri"),
  birthday: z
    .date({
      required_error: "Tug‘ilgan kun majburiy",
      invalid_type_error: "Iltimos, to‘g‘ri sana tanlang",
    })
    .min(minDate, "Tug‘ilgan kun noto‘g‘ri")
    .max(today, "Tug‘ilgan kun kelajakda bo‘lishi mumkin emas"),
  gender: z.enum(["0", "1"]),
  region: z.coerce.number().min(1, "Hududni tanlang"),
  district: z.coerce.number().min(1, "Tuman yoki shaharni tanlang"),
});

type FormValues = z.infer<typeof schema>;

export const Step3PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const received = location.state;
  const { t } = useTranslation();

  useEffect(() => {
    if (!received?.phone) navigate("/auth/sign-up");
  }, [received, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: received?.first_name || "",
      last_name: received?.last_name || "",
      email: received?.email || "",
      birthday: received?.birthday || undefined,
      gender: received?.gender || "0",
      region: received?.region || 2,
      district: received?.district || 16,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...received,
      ...values,
      birthday: values.birthday.toISOString().split("T")[0],
      region: regions.find((a) => Number(a.id) === Number(values.region))
        ?.name_uz,
      district: districts.find((a) => Number(a.id) === Number(values.district))
        ?.name_uz,
    };

    try {
      await axios.put(`${usersApi}accounts/register/step3/`, payload);
      navigate("/auth/sign-up/step4/", { state: payload });
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-108px)] bg-bg-placeholder">
      <Card className="w-full max-w-5xl shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Shaxsiy ma'lumotlar</CardTitle>
          <CardDescription>
            Ro'yhatdan to'liq o'tish uchun shaxsiy ma'lumotlaringizni kiriting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-start justify-between space-x-4">
                <FormField
                  control={form.control}
                  name={"first_name"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t("user.first_name")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ismingizni kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"last_name"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t("user.last_name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Familiyangizni kiriting"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start justify-between space-x-4">
                <FormField
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t("user.email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="example@mail.ru"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel className="capitalize">
                        {t("user.birthday")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-bg-placeholder",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? normalizeDate(new Date(field.value))
                                : t("form.placeholders.select_date")}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) => {
                              field.onChange(date);
                            }}
                            disabled={(date) => date > today || date < minDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="capitalize">
                        {t("user.gender")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Jins" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">{t("Male")}</SelectItem>
                            <SelectItem value="1">{t("Female")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start justify-between space-x-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Viloyat / Hudud</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            form.setValue("district", 2);
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
                    <FormItem className="w-full">
                      <FormLabel>Tuman / Shahar</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts
                              .filter(
                                (d) => d.region_id === form.watch("region")
                              )
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

              <div className="flex items-center justify-end">
                <Button type="submit">
                  <span className="text">Keyingi</span>
                  <span className="icon">
                    <ArrowRightIcon />
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
