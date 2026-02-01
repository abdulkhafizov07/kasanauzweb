import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/context/user";
import LoadingComponent from "@/components/web/loader";
import { usersApi } from "@/server";
import regions from "@/data/regions.json";
import districts from "@/data/districts.json";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons/profile";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const purposesList = [
  "Ish topish maqsadida",
  "Xizmatingizni tanitish uchun",
  "Ishchi yollash uchun",
  "Yangiliklarni kuzatish",
  "Boshqa maqsadda",
];

const formSchema = z.object({
  firstName: z.string().min(1, "Ism majburiy"),
  lastName: z.string().min(1, "Familiya majburiy"),
  middleName: z.string().optional(),
  email: z.string().email("Email xato"),
  birthday: z.string().min(1, "Tug'ilgan sana majburiy"),
  region: z.number().min(1, "Viloyat tanlang"),
  district: z.number().min(1, "Tuman tanlang"),
  about: z.string().optional(),
  biography: z.string().optional(),
  purposes: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ProfileEditPage() {
  const { t } = useTranslation();
  const user = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(user.loading);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      birthday: "",
      region: 2,
      district: 16,
      about: "",
      biography: "",
      purposes: [],
    },
  });

  const watchRegion = form.watch("region");

  useEffect(() => {
    document.title = "Profilni tahrirlash - Kasana.UZ";
  }, []);

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);

    const formData = new FormData();
    for (const key in data) {
      const value = (data as any)[key];
      if (Array.isArray(value)) {
        formData.append(key, value.join(", ").trim());
      } else if (key === "region") {
        formData.append(
          key,
          regions.find((v) => v.id === value)?.name_uz || ""
        );
      } else if (key === "district") {
        formData.append(
          key,
          districts.find((v) => v.id === value)?.name_uz || ""
        );
      } else if (value) {
        formData.append(key, value);
      }
    }

    try {
      await axios.post(`${usersApi}accounts/update/`, formData);
      await user.fetchUser();
      // await navigate("/profile/overview/");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePurpose = (value: string) => {
    const current = form.getValues("purposes") || [];
    if (current.includes(value)) {
      form.setValue(
        "purposes",
        current.filter((v) => v !== value)
      );
    } else {
      form.setValue("purposes", [...current, value]);
    }
  };

  useEffect(() => {
    if (user.loading) return;

    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      middleName: user.middleName || "",
      email: user.email || "",
      birthday: user.birthday || "",
      region: regions.find((value) => value.name_uz === user.region)?.id || 2,
      district:
        districts.find((value) => value.name_uz === user.district)?.id || 16,
      about: user.about || "",
      biography: user.biography || "",
      purposes: user.purposes?.split(",").map((p) => p.trim()) || [],
    });

    setLoading(false);
  }, [user.loading]);

  return loading ? (
    <div className="w-full h-full min-h-36 flex items-center">
      <LoadingComponent />
    </div>
  ) : (
    <div>
      <div className="page-title mb-6 flex justify-between items-center">
        <h2 className="text-4xl font-bold">{t("Edit")}</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ism</FormLabel>
                <FormControl>
                  <Input placeholder="Ism" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Familiya</FormLabel>
                <FormControl>
                  <Input placeholder="Familiya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Middle Name */}
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sharif</FormLabel>
                <FormControl>
                  <Input placeholder="Sharif" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span></span>

          {/* Birthday */}
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tug'ilgan sana</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Viloyat</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name_uz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* District */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tuman (shahar)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    value={field.value.toString()}
                    disabled={!watchRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tumanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts
                        .filter((value) => value.region_id === watchRegion)
                        .map((d, i) => (
                          <SelectItem key={i} value={d.id.toString()}>
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

          {/* About */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Haqingizda</FormLabel>
                <FormControl>
                  <Textarea placeholder="Text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Biography */}
          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Biografiya</FormLabel>
                <FormControl>
                  <Textarea placeholder="Text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Purposes */}
          <FormField
            control={form.control}
            name="purposes"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel>Maqsadlar</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {purposesList.map((value, i) => {
                    const selected = form.watch("purposes")?.includes(value);
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        onClick={() => togglePurpose(value)}
                        className={
                          i === purposesList.length - 1 ? "col-span-2" : ""
                        }
                      >
                        <CheckIcon
                          size={18}
                          className={`mr-2 ${
                            selected ? "text-white" : "text-gray-400"
                          }`}
                        />
                        {value}
                      </Button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end">
            <Button type="submit" className="px-8">
              Saqlash
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
