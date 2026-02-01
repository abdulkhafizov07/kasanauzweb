import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from "axios";
import { usersApi } from "@/server";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";

const createFormSchema = (t: (key: string) => string) =>
    z
        .object({
            first_name: z.string().min(1, t("form.errors.name_required")),
            phone: z.string().refine(isValidPhoneNumber, {
                message: t("form.errors.invalid_phone"),
            }),
            password: z.string().min(6, t("form.errors.password_required")),
            confirmPassword: z
                .string()
                .min(6, t("form.errors.confirm_password_required")),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("form.errors.passwords_must_match"),
            path: ["confirmPassword"],
        });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const showErrorToast = (
        titleKey: string,
        descriptionKey?: string,
        fallback?: string
    ) => {
        toast.error(t(titleKey), {
            description: descriptionKey ? t(descriptionKey) : fallback || "",
        });
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(createFormSchema(t)),
        defaultValues: {
            first_name: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        axios
            .post(`${usersApi}accounts/register/step1/`, values)
            .then(() => {
                navigate("/auth/sign-up/step2/", { state: values });
            })
            .catch((err) => {
                const method = String(err.config?.method || "").toUpperCase();
                if (method === "OPTIONS") return;

                if (err.code === "ERR_NETWORK") {
                    showErrorToast(
                        "errors.network_error",
                        "errors.fetch_failed"
                    );
                } else if (err.response?.status === 404) {
                    showErrorToast("errors.not_found_error");
                } else {
                    showErrorToast("errors.server_error");
                }
            });
    };

    useEffect(() => {
        document.title = `${t("sign-up.title")} - Kasana.UZ`;
    }, []);

    return (
        <div className="flex items-center justify-center h-[calc(100vh-108px)] bg-bg-placeholder">
            <Card className={cn("shadow-none border-none w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {t("sign-up.title")}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t("sign-up.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Name / Ism */}
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("sign-up.name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ismingiz"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={(field) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("sign-up.phone-number")}
                                        </FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                defaultCountry="UZ"
                                                countries={["UZ"]}
                                                placeholder="95 999 99 99"
                                                value={field.field.value}
                                                onChange={field.field.onChange}
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
                                            {t("sign-up.password")}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Kuchli parol kiriting"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("sign-up.confirm-password")}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Parolni qayta kiriting"
                                                noVerify
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button type="submit" className="w-full">
                                {t("Register")}
                            </Button>

                            {/* Login Link */}
                            <p className="text-center text-sm">
                                {t("Have account")}{" "}
                                <Link
                                    to="/auth/sign-in/"
                                    className="text-primary underline"
                                >
                                    {t("Login")}
                                </Link>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
