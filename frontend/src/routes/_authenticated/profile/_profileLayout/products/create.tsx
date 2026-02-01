import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RenderField } from "@/lib/render-field";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MultiImageUpload from "@/components/ui/multiimage";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProductCategory } from "@/types/onlineshop";
import LoadingComponent from "@/components/web/loader";
import {
    priceValidator,
    shortDescriptionValidator,
    descriptionValidator,
    titleValidator,
    requiredSelect,
} from "@/lib/validators";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute(
    "/_authenticated/profile/_profileLayout/products/create"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation(undefined, {
        keyPrefix: "profile.onlineshop.products.create",
    });
    const navigate = useNavigate();

    const [showDiscount, setShowDiscount] = useState(false);

    const form = useForm({
        defaultValues: {
            title: "",
            short_description: "",
            description: "",
            price: "",
            discount_percent: "",
            price_discount: "",
            category: "",
            images: [] as File[],
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData();
            formData.append("title", value.title);
            formData.append("short_description", value.short_description);
            formData.append("description", value.description);
            formData.append("price", value.price);

            if (value.price_discount) {
                formData.append("price_discount", value.price_discount);
            }

            formData.append("category", value.category);

            value.images.forEach((file: File) => {
                formData.append("images_upload", file);
            });

            try {
                const res = await api.post(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/onlineshop/api/profile/products/upload/`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (res.status === 201) {
                    form.reset();
                    navigate({ to: "/profile/products" });
                } else {
                    throw res;
                }
            } catch (err: any) {
                if (err.response?.status === 400) {
                    const errorMap: Record<string, string> = {};
                    for (const field of Object.keys(err.response.data)) {
                        const messages = err.response.data[field] as string[];
                        errorMap[field] = messages.join(" ");
                    }
                    form.setErrorMap({ onChange: { fields: errorMap } });
                    return errorMap;
                }
                throw err;
            }
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const formImages = values.images;

    useEffect(() => {
        if (showDiscount && values.price && values.discount_percent) {
            const p = parseFloat(values.price);
            const d = parseFloat(values.discount_percent);
            if (!isNaN(p) && !isNaN(d)) {
                const discounted = p * (1 - d / 100);
                form.setFieldValue("price_discount", discounted.toFixed(2));
            }
        }
    }, [showDiscount, values.price, values.discount_percent]);

    const { data: categories, isLoading } = useQuery<ProductCategory[]>({
        queryKey: ["user", "categories"],
        queryFn: async () => {
            const response = await api.get<ProductCategory[]>(
                `${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/categories/`
            );
            return response.data;
        },
    });

    useEffect(() => {
        document.title = `${t("title")} - Kasana.UZ`;
    }, [t]);

    if (isLoading) return <LoadingComponent />;

    return (
        <>
            <div className="mb-4">
                <h3 className="title text-lg md:text-2xl font-bold">
                    {t("title")}
                </h3>
            </div>

            <div className="mb-3">
                <form
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <RenderField
                        form={form}
                        name="title"
                        labelKey="title"
                        inputComponent={
                            <Input placeholder={t("placeholder.title")} />
                        }
                        validator={titleValidator}
                        translationOptions={{
                            keyPrefix:
                                "profile.onlineshop.products.create.fields",
                        }}
                    />

                    <div className="lg:col-span-3">
                        <RenderField
                            form={form}
                            name="short_description"
                            labelKey="short_description"
                            inputComponent={
                                <Textarea
                                    rows={3}
                                    placeholder={t(
                                        "placeholder.short_description"
                                    )}
                                />
                            }
                            validator={shortDescriptionValidator}
                            translationOptions={{
                                keyPrefix:
                                    "profile.onlineshop.products.create.fields",
                            }}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <RenderField
                            form={form}
                            name="description"
                            labelKey="description"
                            inputComponent={
                                <Textarea
                                    rows={6}
                                    placeholder={t("placeholder.description")}
                                />
                            }
                            validator={descriptionValidator}
                            translationOptions={{
                                keyPrefix:
                                    "profile.onlineshop.products.create.fields",
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-3 col-span-3 gap-4">
                        <RenderField
                            form={form}
                            name="price"
                            labelKey="price"
                            inputComponent={
                                <Input
                                    type="number"
                                    placeholder={t("placeholder.price")}
                                />
                            }
                            validator={priceValidator}
                            translationOptions={{
                                keyPrefix:
                                    "profile.onlineshop.products.create.fields",
                            }}
                        />

                        <div className="flex flex-col">
                            <label htmlFor="discount-switch">Chegirma</label>
                            <div className="h-full flex items-center justify-start">
                                <Switch
                                    id="discount-switch"
                                    checked={showDiscount}
                                    onCheckedChange={setShowDiscount}
                                />
                            </div>
                        </div>
                    </div>

                    {showDiscount && (
                        <>
                            <div className="grid grid-cols-3 col-span-3 gap-4">
                                <RenderField
                                    form={form}
                                    name="discount_percent"
                                    labelKey="discount_percent"
                                    inputComponent={
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="%"
                                        />
                                    }
                                    validator={(value) =>
                                        !value
                                            ? "Chegirma foizini kiriting"
                                            : parseInt(value) < 0 ||
                                              parseInt(value) > 100
                                            ? "0 va 100 oralig‘ida bo‘lishi kerak"
                                            : undefined
                                    }
                                    translationOptions={{
                                        keyPrefix:
                                            "profile.onlineshop.products.create.fields",
                                    }}
                                />

                                <RenderField
                                    form={form}
                                    name="price_discount"
                                    labelKey="price_discount"
                                    inputComponent={
                                        <Input type="number" disabled />
                                    }
                                    translationOptions={{
                                        keyPrefix:
                                            "profile.onlineshop.products.create.fields",
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <RenderField
                        form={form}
                        name="category"
                        labelKey="category"
                        inputComponent={
                            <Select>
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t("placeholder.category")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat: ProductCategory) => (
                                        <SelectItem
                                            key={cat.guid}
                                            value={cat.guid}
                                        >
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                        validator={requiredSelect}
                        translationOptions={{
                            keyPrefix:
                                "profile.onlineshop.products.create.fields",
                        }}
                    />

                    <div className="lg:col-span-3">
                        <RenderField
                            form={form}
                            name="images"
                            inputComponent={
                                <MultiImageUpload value={formImages} />
                            }
                            labelKey="images"
                            validator={(files: File[]) =>
                                !files || files.length === 0
                                    ? "Kamida 1 ta rasm yuklang"
                                    : files.length > 4
                                    ? "Maksimal 4 ta rasm yuklash mumkin"
                                    : undefined
                            }
                            translationOptions={{
                                keyPrefix:
                                    "profile.onlineshop.products.create.fields",
                            }}
                        />
                    </div>

                    {/* Submit */}
                    <div className="lg:col-span-3 flex justify-end">
                        <Button type="submit">{t("submit")}</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
