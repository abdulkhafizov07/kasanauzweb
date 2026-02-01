import LoadingComponent from "@/components/web/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onlineShopApi, usersApi } from "@/server";
import { UserType } from "@/types/admin/users";
import { ProductType } from "@/types/onlineshop";
import { formatPhone, normalizeDate, normalizeDateTime } from "@/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export type ProductImageType = {
  guid: string;
  image: string;
};

export type ProductCommentType = {
  guid: string;
  comment: string;
};

export type RelatedType = {
  comments: ProductCommentType[];
  images: ProductImageType[];
};

export const DeletePage: React.FC = () => {
  const { t } = useTranslation();
  const { guid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [related, setRelated] = useState<RelatedType | null>(null);

  const showErrorToast = (
    titleKey: string,
    descriptionKey?: string,
    fallback?: string
  ) => {
    toast.error(t(titleKey), {
      description: descriptionKey ? t(descriptionKey) : fallback || "",
    });
  };

  const fetchData = async () => {
    if (!guid) return;

    setLoading(true);

    try {
      const [userRes, relatedRes] = await Promise.all([
        axios.get(`${onlineShopApi}dashboard/product/${guid}/`),
        axios.get(`${onlineShopApi}dashboard/product_related_objects/${guid}/`),
      ]);

      setProduct(userRes.data);
      setRelated(relatedRes.data);
    } catch (err: any) {
      const isOptions = String(err.config?.method).toUpperCase() === "OPTIONS";

      if (isOptions) return;

      if (err.code === "ERR_NETWORK") {
        showErrorToast("errors.network_error", "errors.fetch_failed");
      } else if (err.response?.status === 404) {
        showErrorToast("errors.not_found_error");
      } else {
        showErrorToast("errors.server_error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!guid) return;

    try {
      await axios.delete(
        `${onlineShopApi}dashboard/product_related_objects/${guid}/`
      );

      await axios.delete(`${onlineShopApi}dashboard/product/delete/${guid}/`);

      toast.success(t("messages.delete_success"));
      navigate("/admin/onlineshop/products");
    } catch (err: any) {
      if (err.code === "ERR_NETWORK") {
        showErrorToast("errors.network_error", "errors.delete_failed");
      } else if (err.response?.status === 404) {
        showErrorToast("errors.not_found_error", "errors.delete_failed");
      } else {
        showErrorToast("errors.server_error", "errors.delete_failed");
      }
    }
  };

  useEffect(() => {
    if (guid) {
      fetchData();
    }
  }, [guid]);

  return (
    <>
      <div id="delete-users-page" className="px-3">
        <div className="page-title mb-3">
          <h3 className="text-2xl font-semibold">
            Mahsulotni o'chirib yuborish
          </h3>
        </div>

        <div className="flex items-start justify-start space-x-3">
          <div className="w-1/2 h-auto bg-white rounded-lg p-4">
            {loading ? (
              <div className="py-8">
                <LoadingComponent />
              </div>
            ) : product ? (
              <>
                <div className="w-full lg:w-1/2 h-auto bg-white rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Mahsulot ma'lumotlari
                  </h3>

                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-semibold">Sarlavha:</span>{" "}
                      <span className="font-medium">{product.title}</span>
                    </li>

                    <li>
                      <span className="font-semibold">Meta:</span>{" "}
                      <span className="font-medium">{product.meta}</span>
                    </li>

                    <li>
                      <span className="font-semibold">Narxi:</span>{" "}
                      <span className="font-medium">
                        {Number(product.price).toLocaleString("uz-UZ")} so'm
                      </span>
                    </li>

                    <li>
                      <span className="font-semibold">Chegirma:</span>{" "}
                      <span className="font-medium">
                        {product.price_discount
                          ? Number(product.price_discount).toLocaleString(
                              "uz-UZ"
                            ) + " so'm"
                          : "Yo'q"}
                      </span>
                    </li>

                    <li>
                      <span className="font-semibold">Kategoriya GUID:</span>{" "}
                      <span className="font-medium">{product.category}</span>
                    </li>

                    <li>
                      <span className="font-semibold">Yaratilgan sana:</span>{" "}
                      <span className="font-medium">
                        {normalizeDateTime(product.created_at)}
                      </span>
                    </li>

                    <li>
                      <span className="font-semibold">Qisqacha tavsif:</span>{" "}
                      <span className="font-medium">
                        {product.short_description}
                      </span>
                    </li>

                    <li>
                      <span className="font-semibold">Tavsif:</span>
                      <p className="font-medium whitespace-pre-line mt-1 text-muted-foreground">
                        {product.description}
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="w-full flex space-x-2 justify-end">
                  <Button variant={"outline"} className="cursor-pointer">
                    Bekor qilish
                  </Button>
                  <Button
                    variant={"destructive"}
                    className="cursor-pointer"
                    onClick={handleDelete}
                  >
                    O'chirish
                  </Button>
                </div>
              </>
            ) : (
              <p className="font-medium text-description text-center my-4">
                Mahsulot ma'lumotlari yo'q
              </p>
            )}
          </div>
          <div className="w-1/2 h-auto bg-white rounded-lg p-4">
            {loading ? (
              <div className="py-8">
                <LoadingComponent />
              </div>
            ) : (
              <>
                {related?.comments || related?.images ? (
                  <div>
                    <h4 className="text-lg font-medium">Fikrlar</h4>
                    {related.comments?.length > 0 ? (
                      related.comments.map((comment: any, index: number) => (
                        <p
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {comment.text}
                        </p>
                      ))
                    ) : (
                      <p className="text-description font-semibold">
                        Mahsulot onlayn bozorda fikrlari yo'q
                      </p>
                    )}
                    <hr className="my-3" />

                    <h4 className="text-lg font-medium">Rasmlar</h4>
                    {related.images?.length > 0 ? (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {related.images.map((image: any, index: number) => (
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={`${onlineShopApi?.replace("/api/", "")}${
                                image.image
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-description font-semibold">
                        Mahsulot onlayn bozorda rasmlari yo'q
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium text-description text-center my-4">
                    Mahsulot aloqador ma'lumotlar yo'q
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
