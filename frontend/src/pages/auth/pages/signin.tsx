import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { useUserContext } from "@/context/user";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import LoadingComponent from "@/components/web/loader";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAlertDialog } from "@/hooks/useAlertDialog";

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        phone: z
            .string()
            .min(9, t("form.errors.phone_required"))
            .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
        password: z.string().min(6, t("form.errors.password_required")),
    });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export const SignInPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const alert = useAlertDialog();
    const { loading, login } = useUserContext();

    const form = useForm<FormValues>({
        resolver: zodResolver(createFormSchema(t)),
        defaultValues: {
            phone: "",
            password: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        login(values)
            .then((res) => {
                if (res.success) {
                    toast.success("Tizimga muvaffaqiyatli kirdingiz", {
                        description: (
                            <span className="text-black/40">
                                Endi barcha funksiyalardan foydalanishingiz
                                mumkin.
                            </span>
                        ),
                    });
                    navigate("/profile/overview");
                } else {
                    toast.error("Kirish amalga oshmadi", {
                        description: (
                            <span className="text-black/40">
                                Iltimos, telefon raqam yoki parolni tekshirib
                                qaytadan urinib ko‘ring.
                            </span>
                        ),
                    });
                    alert("Kirish amalga oshmadi", {
                        description:
                            "Iltimos, telefon raqam yoki parolni tekshirib qaytadan urinib ko'ring",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh-108px)] bg-bg-placeholder">
                <Card className="shadow-none border-none bg-white w-96">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            {t("sign-in.title")}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {t("sign-in.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <>
                                <div className="py-12">
                                    <LoadingComponent />
                                </div>
                            </>
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    {/* Phone */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("sign-up.phone-number")}
                                                </FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        defaultCountry="UZ"
                                                        countries={["UZ"]}
                                                        placeholder="95 999 99 99"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Password */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("sign-in.password")}
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        {...field}
                                                        noVerify
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <Button type="submit" className="w-full">
                                        {t("sign-in.title")}
                                    </Button>

                                    <Button
                                        asChild
                                        className={cn(
                                            "w-full text-indigo-400 hover:text-white hover:bg-indigo-400 border-2 border-indigo-400 bg-transparent"
                                        )}
                                    >
                                        <a href="https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=kasana_mehnat_uz&redirect_uri=https://kasana.mehnat.uz/auth/oneid&scope=myportal&state=testState">
                                            OneId bilan davom etish
                                        </a>
                                    </Button>

                                    <p className="text-center text-sm">
                                        {t("sign-in.dont-have-an-account")}{" "}
                                        <Link
                                            to="/auth/sign-up/"
                                            className="text-primary underline"
                                        >
                                            {t("sign-up.title")}
                                        </Link>
                                    </p>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
