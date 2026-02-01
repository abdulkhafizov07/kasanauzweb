import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { formatPhone } from "@/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import LoadingComponent from "@/components/web/loader";
import { EditIcon } from "lucide-react";
import api from "@/lib/api";
import { useAlertDialog } from "@/hooks/useAlertDialog";

export const Route = createFileRoute(
    "/_authenticated/profile/_profileLayout/overview"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const alert = useAlertDialog();

    const handlePhotoChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();

        const file = event.target.files?.[0];
        if (!file) {
            console.warn("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("pfp", file);

        try {
            await api.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/api/pfp-update/`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("Profil surati yangilandi ✅", {
                description: "Yangi profil rasmingiz muvaffaqiyatli saqlandi.",
                confirmText: "Davom etish",
                onConfirm() {
                    window.location.reload();
                },
            });
        } catch (error) {
            alert("Xatolik yuz berdi ❌", {
                description:
                    "Profil suratini yangilashda muammo bo‘ldi. Qaytadan urinib ko‘ring.",
                confirmText: "Tushunarli",
                onConfirm() {
                    window.location.reload();
                },
            });
            console.error("Failed to update profile photo:", error);
        }
    };

    if (isLoading) {
        return (
            <>
                <LoadingComponent />
            </>
        );
    }

    const display = [
        { name: t("profile.first_name"), value: user?.first_name },
        { name: t("profile.last_name"), value: user?.last_name },
        { name: t("profile.middle_name"), value: user?.middle_name },
        {
            name: t("profile.phone"),
            value: formatPhone(user?.phone),
        },
        {
            name: t("profile.email"),
            value: user?.email || t("profile.undefined"),
        },
        {
            name: t("profile.birthday"),
            value: user?.birthday || t("profile.undefined"),
        },
        {
            name: t("profile.region&district"),
            value:
                user?.region || user?.district
                    ? [user.region, user.district].join(", ")
                    : t("profile.undefined"),
        },
        {
            name: t("profile.gender"),
            value: user?.gender === 0 ? t("profile.male") : t("profile.female"),
        },
        {
            name: t("profile.purposes"),
            value: user?.purposes || t("profile.undefined"),
        },
    ];

    return (
        <>
            <div className="page-title flex w-full items-center justify-between mb-6">
                <h2 className="title text-lg md:text-2xl font-bold">
                    Shaxsiy ma'lumotlarim
                </h2>

                <Button asChild className="h-9">
                    <Link to="/profile/edit">
                        <span className="text hidden md:inline">
                            Tahrirlash
                        </span>
                        <span className="icon">
                            <EditIcon />
                        </span>
                    </Link>
                </Button>
            </div>

            <div className="w-full mb-6">
                <div className="image">
                    <div className="relative mx-auto sm:mx-0 bg-brand aspect-4 w-36 h-36 border-2 border-background rounded-lg overflow-hidden">
                        <img
                            src={
                                user?.pfp
                                    ? `${user.pfp}`
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
                </div>

                <div className="text-grid grid grid-cols-1 sm:grid-cols-2 mt-3 gap-4">
                    {display.map((value, index) => (
                        <div
                            className="element flex flex-col items-start justify-start"
                            key={index}
                        >
                            <span className="title text-lg font-bold">
                                {value.name}
                            </span>
                            <span className="text text-description">
                                {value.value}
                            </span>
                        </div>
                    ))}
                    <div className="element flex flex-col items-start justify-start sm:col-span-2">
                        <span className="title text-lg font-bold">
                            {t("profile.about")}
                        </span>
                        <span className="text text-description">
                            {user?.about || t("profile.undefined")}
                        </span>
                    </div>
                    <div className="element flex flex-col items-start justify-start sm:col-span-2">
                        <span className="title text-lg font-bold">
                            {t("profile.about")}
                        </span>
                        <span className="text text-description">
                            {user?.biography || t("profile.undefined")}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
