import LoadingComponent from "@/components/web/loader";
import { useUserContext } from "@/context/user";
import { announcementsApi } from "@/server";
import { AnnouncementType } from "@/types/announcements";
import axios from "axios";
import React, { useState } from "react";

export const VerifyAnnouncementWidget: React.FC<{
  announcement: AnnouncementType | null;
  setAnnouncement: React.Dispatch<
    React.SetStateAction<AnnouncementType | null>
  >;
}> = ({ announcement, setAnnouncement }) => {
  const { role } = useUserContext();
  const [loading, setLoading] = useState(false);

  if (!["admin", "moderator"].includes(role)) return null;

  const handleVerify = () => {
    setLoading(true);
    axios
      .post(`${announcementsApi}dashboard/verify/`, {
        meta: announcement?.meta,
      })
      .then((res) => {
        if (res.status === 200 && res.data && res.data.announcement) {
          setAnnouncement(res.data.announcement);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full h-auto mb-5">
      <button
        className={
          "float-right py-1.5 px-6 border-2 rounded-lg cursor-pointer " +
          (announcement?.is_verified
            ? "bg-white text-text hover:text-brand border-brand"
            : "bg-brand text-white border-brand")
        }
        type="button"
        onClick={handleVerify}
      >
        {loading ? (
          <>
            <LoadingComponent />
          </>
        ) : (
          <>{announcement?.is_verified ? "Tasdiqdan olish" : "Tasdiqlash"}</>
        )}
      </button>
    </div>
  );
};
