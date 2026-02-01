import LoadingComponent from "@/components/web/loader";
import { Button } from "@/components/ui/button";
import { announcementsApi } from "@/server";
import { AnnouncementType } from "@/types/announcements";
import { normalizeDateTime } from "@/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const DeletePage: React.FC = () => {
  const { t } = useTranslation();
  const { type, guid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(
    null
  );

  const showErrorToast = (
    titleKey: string,
    descriptionKey?: string,
    fallback?: string
  ) => {
    toast.error(t(titleKey), {
      description: (
        <span className="text-black/40">
          {descriptionKey ? t(descriptionKey) : fallback || ""}
        </span>
      ),
    });
  };

  const fetchData = async () => {
    if (!guid) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${announcementsApi}dashboard/announcement/${guid}/`
      );
      setAnnouncement(res.data);
    } catch (err: any) {
      if (String(err.config?.method).toUpperCase() === "OPTIONS") return;
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
        `${announcementsApi}dashboard/announcement/delete/${guid}/`
      );
      toast.success(t("messages.delete_success"));
      navigate(
        `/admin/announcements/${
          ["all", "work", "service"].includes(type || "") ? type : "all"
        }`
      );
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
    if (guid) fetchData();
  }, [guid]);

  return (
    <div id="delete-users-page" className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">E`lon o'chirib yuborish</h3>
      </div>

      <div className="flex items-start justify-start space-x-3">
        <div className="w-1/2 h-auto bg-white rounded-lg p-4">
          {loading ? (
            <div className="py-8">
              <LoadingComponent />
            </div>
          ) : announcement ? (
            <>
              <div className="w-full h-auto bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  E`lon ma'lumotlari
                </h3>

                {announcement.thumbnail && (
                  <div className="aspect-[16/9]"></div>
                )}

                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-semibold">Sarlavha:</span>{" "}
                    <span className="font-medium">{announcement.title}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Meta:</span>{" "}
                    <span className="font-medium">{announcement.meta}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Narxi:</span>{" "}
                    <span className="font-medium">
                      {announcement.dealed ? (
                        "Kelshilingan"
                      ) : (
                        <>
                          {Number(announcement.price_min).toLocaleString(
                            "uz-UZ"
                          )}
                          -
                          {Number(announcement.price_max).toLocaleString(
                            "uz-UZ"
                          )}{" "}
                          so'm
                        </>
                      )}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Hudud (shaxar):</span>{" "}
                    <span className="font-medium">{announcement.region}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Tuman:</span>{" "}
                    <span className="font-medium">{announcement.district}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Manzil:</span>{" "}
                    <span className="font-medium">{announcement.address}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Tajriba:</span>{" "}
                    <span className="font-medium">
                      {announcement.experience}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Ish vaqti:</span>{" "}
                    <span className="font-medium">
                      {
                        {
                          full_time: t("Full time"),
                          part_time: t("Part time"),
                          flexable_time: t("Flexable time"),
                        }[announcement.work_time]
                      }
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Yaratilgan sana:</span>{" "}
                    <span className="font-medium">
                      {normalizeDateTime(announcement.created_at)}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Qisqacha tavsif:</span>{" "}
                    <span className="font-medium">
                      {announcement.short_description}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Tavsif:</span>
                    <p className="font-medium whitespace-pre-line mt-1 text-muted-foreground">
                      {announcement.description}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="w-full flex space-x-2 justify-end mt-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Bekor qilish
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  O'chirish
                </Button>
              </div>
            </>
          ) : (
            <p className="font-medium text-description text-center my-4">
              E`lon ma'lumotlari yo'q
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
