import React, { ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usersApi } from "../../../server";
import { useUserContext } from "../../../context/user";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Phone {
  phone: string;
}

const formatPhone = ({ phone }: Phone): string => {
  phone = phone.toString();
  return `+998 (${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${phone[4]}-${phone[5]}${phone[6]}-${phone[7]}${phone[8]}`;
};

const ProfileDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user } = useUserContext();

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const display = [
    { name: t("First name"), value: user.firstName },
    { name: t("Last name"), value: user.lastName },
    { name: t("Middle name"), value: user.middleName },
    {
      name: t("Phone number"),
      value: formatPhone({ phone: user.phone.toString() }),
    },
    { name: t("Email"), value: user.email || t("Undefined") },
    { name: t("Birthday"), value: user.birthday || t("Undefined") },
    {
      name: t("Village, District"),
      value:
        user.region || user.district
          ? [user.region, user.district].join(", ")
          : "Kiritilinmagan",
    },
    { name: t("Gender"), value: user.gender === 0 ? t("Male") : t("Female") },
    { name: t("Purposes"), value: user.purposes || "Kiritilinmagan" },
  ];

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-2xl font-bold">Shaxsiy ma'lumotlarim</h2>

        <Button asChild>
          <Link to="/profile/overview/edit/">
            <span className="text">Tahrirlash</span>
            <span className="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1423_19081)">
                  <path
                    d="M7.33398 2.66665H2.66732C2.3137 2.66665 1.97456 2.80713 1.72451 3.05718C1.47446 3.30723 1.33398 3.64637 1.33398 3.99999V13.3333C1.33398 13.6869 1.47446 14.0261 1.72451 14.2761C1.97456 14.5262 2.3137 14.6667 2.66732 14.6667H12.0007C12.3543 14.6667 12.6934 14.5262 12.9435 14.2761C13.1935 14.0261 13.334 13.6869 13.334 13.3333V8.66665M12.334 1.66665C12.5992 1.40144 12.9589 1.25244 13.334 1.25244C13.7091 1.25244 14.0688 1.40144 14.334 1.66665C14.5992 1.93187 14.7482 2.29158 14.7482 2.66665C14.7482 3.04173 14.5992 3.40144 14.334 3.66665L8.00065 9.99999L5.33398 10.6667L6.00065 7.99999L12.334 1.66665Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1423_19081">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </Link>
        </Button>
      </div>

      <div className="content profile-data">
        <div className="image">
          <div className="relative image-container bg-brand aspect-4 w-36 h-36 border-2 border-background rounded-lg overflow-hidden">
            <img
              src={
                user.pfp
                  ? `${usersApi?.split("/api/")[0]}${user.pfp}`
                  : "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
              }
              alt="Profile"
              className="object-fill"
            />
            <label
              htmlFor="photo"
              className="absolute flex items-center justify-center py-2 px-2 bottom-2 right-2 bg-background text-description rounded-full"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 1.99999H2C1.73478 1.99999 1.48043 2.10535 1.29289 2.29288C1.10536 2.48042 1 2.73477 1 2.99999V9.99999C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8946 1.73478 11 2 11H9C9.26522 11 9.51957 10.8946 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 9.99999V6.49999M9.25 1.24999C9.44891 1.05108 9.7187 0.939331 10 0.939331C10.2813 0.939331 10.5511 1.05108 10.75 1.24999C10.9489 1.4489 11.0607 1.71869 11.0607 1.99999C11.0607 2.2813 10.9489 2.55108 10.75 2.74999L6 7.49999L4 7.99999L4.5 5.99999L9.25 1.24999Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            <input
              type="file"
              id="photo"
              className="hidden"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="awards-container"></div>
        </div>

        <div className="text-grid grid grid-cols-2 mt-3 gap-4">
          {display.map((value, index) => (
            <div
              className="element flex flex-col items-start justify-start"
              key={index}
            >
              <span className="title text-lg font-bold">{value.name}</span>
              <span className="text text-description">{value.value}</span>
            </div>
          ))}
          <div className="element flex flex-col items-start justify-start col-span-2">
            <span className="title text-lg font-bold">Men haqimda</span>
            <span className="text text-description">
              {user.about || t("Undefined")}
            </span>
          </div>
          <div className="element flex flex-col items-start justify-start col-span-2">
            <span className="title text-lg font-bold">Biografiya</span>
            <span className="text text-description">
              {user.biography || t("Undefined")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetailPage;
