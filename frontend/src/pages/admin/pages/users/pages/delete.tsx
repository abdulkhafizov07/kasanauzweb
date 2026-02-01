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

export type ProductType = {
  guid: string;
  title: string;
  short_description: string;
  product_images_onlineshop: ProductImageType[];
};

export type RelatedType = {
  onlineshop?: {
    products: ProductType[];
    comments: ProductCommentType[];
  };
};

export const DeletePage: React.FC = () => {
  const { t } = useTranslation();
  const { guid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [related, setRelated] = useState<RelatedType>({});

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
        axios.get(`${usersApi}dashboard/users/${guid}/`),
        axios.get(`${onlineShopApi}dashboard/user_releted_objects/${guid}/`),
      ]);

      setUser(userRes.data);
      setRelated((prev) => ({ ...prev, onlineshop: relatedRes.data }));
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
        `${onlineShopApi}dashboard/user_releted_objects/${guid}/`
      );

      await axios.delete(`${usersApi}dashboard/users/delete/${guid}/`);

      toast.success(t("messages.delete_success"));
      navigate("/admin/users");
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
            Foydalanuvchini o'chirib yuborish
          </h3>
        </div>

        <div className="flex items-start justify-start space-x-3">
          <div className="w-1/2 h-auto bg-white rounded-lg p-4">
            {loading ? (
              <div className="py-8">
                <LoadingComponent />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center justify-start mb-5">
                  <div className="w-24 h-24 overflow-hidden rounded-full border">
                    <img
                      src={`${usersApi?.replace("/api/", "")}${user.pfp}`}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <ul className="space-y-2 text-sm mb-3">
                  <li>
                    <span className="font-semibold">
                      {t("user.first_name")}:
                    </span>{" "}
                    <span className="font-medium">
                      {user.first_name || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {t("user.last_name")}:
                    </span>{" "}
                    <span className="font-medium">
                      {user.last_name || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.phone")}:</span>{" "}
                    <span className="font-medium">
                      {user.phone ? formatPhone(user.phone) : "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.email")}:</span>{" "}
                    <span className="font-medium">
                      {user.email || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.district")}:</span>{" "}
                    <span className="font-medium">
                      {user.district || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.region")}:</span>{" "}
                    <span className="font-medium">
                      {user.region || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.gender")}:</span>{" "}
                    <span className="font-medium">
                      {user.gender === 0
                        ? "Erkak"
                        : user.gender === 1
                        ? "Ayol"
                        : "Noma'lum"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.purposes")}:</span>{" "}
                    <span className="font-medium">
                      {user.purposes || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.birthday")}:</span>{" "}
                    <span className="font-medium">
                      {user.birthday
                        ? normalizeDate(user.birthday)
                        : "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {t("user.biography")}:
                    </span>{" "}
                    <span className="font-medium">
                      {user.biography || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.about")}:</span>{" "}
                    <span className="font-medium">
                      {user.about || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">{t("user.role")}:</span>{" "}
                    <span className="font-medium">
                      {user.role || "Kiritilinmagan"}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {t("user.created_at")}:
                    </span>{" "}
                    <span className="font-medium">
                      {normalizeDateTime(user.created_at)}
                    </span>
                  </li>
                </ul>

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
                Foydalanuvchi ma'lumotlari yo'q
              </p>
            )}
          </div>
          <div className="w-1/2 h-auto bg-white rounded-lg p-4">
            {loading ? (
              <div className="py-8">
                <LoadingComponent />
              </div>
            ) : related.onlineshop &&
              (related.onlineshop?.comments.length > 1 ||
                related.onlineshop?.products.length > 1) ? (
              <>
                <h3 className="text-xl font-medium mb-3">
                  Onlayn bozorga aloqalari
                </h3>
                {related.onlineshop ? (
                  <>
                    <h4 className="text-lg font-medium mb-3.5">Mahsulotlar</h4>
                    {related.onlineshop.products.length > 1 ? (
                      related.onlineshop.products.map((value, index) => (
                        <>
                          <Card key={index} className="mb-3 shadow-none">
                            <CardHeader>
                              <CardTitle>{value.title}</CardTitle>
                              <CardDescription>
                                {value.short_description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {value.product_images_onlineshop?.map(
                                  (value_image, image_index) => (
                                    <div
                                      key={image_index}
                                      className="aspect-square overflow-hidden rounded-lg"
                                    >
                                      <img
                                        src={value_image.image}
                                        alt={
                                          "Image number " +
                                          String(image_index + 1)
                                        }
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ))
                    ) : (
                      <>
                        <p className="text-description font-semibold">
                          Foydalanuvchi onlayn bozorda mahsulotlari yo'q
                        </p>
                      </>
                    )}
                    <hr className="my-3" />
                    <h4 className="text-lg font-medium">Fikrlar</h4>
                    {related.onlineshop.comments.length > 1 ? (
                      <></>
                    ) : (
                      <>
                        <p className="text-description font-semibold">
                          Foydalanuvchi onlayn bozorda fikrlari yo'q
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-description font-semibold">
                      Foydalanuvchi onlayn bozorda aloqalari yo'q
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="font-medium text-description text-center my-4">
                Foydalanuvchi aloqador ma'lumotlar yo'q
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
