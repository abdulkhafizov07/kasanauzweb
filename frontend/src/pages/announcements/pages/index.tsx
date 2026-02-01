import React, { useEffect } from "react";
import { useUserContext } from "@/context/user";
import { useAnnouncements } from "@/context/announcements";
import { Link } from "react-router-dom";
import AnnouncementWidget from "@/components/web/announcements/work-card";

import PosterImage from "@/assets/announcements/poster.png";
import ServiceWidget from "@/components/web/announcements/service-card";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t } = useTranslation("pages.announcements");
    const { isAuthenticated } = useUserContext();
    const { serviceAnnouncements, workAnnouncement } = useAnnouncements();

    useEffect(() => {
        document.title = `${t("title")} - Kasana.UZ`;
    }, [t]);

    return (
        <div className="min-h-[calc(100vh-141px)]">
            {/* Mini Poster */}
            <div className="h-[250px] flex justify-between relative overflow-hidden">
                <div className="relative z-30 container mx-auto max-w-[1366px]">
                    <div className="h-full flex items-center text-5xl font-semibold text-white pl-5 md:pl-0 z-30">
                        E'lonlar
                    </div>
                </div>
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#41a584e7] to-[#41a584e7] z-10"></div>
                <img
                    src={PosterImage}
                    alt=""
                    className="absolute z-20 w-1/2 object-fit -top-1/2 right-0"
                />
            </div>

            {/* Announcement Banner */}
            {isAuthenticated && (
                <div className="bg-tbrand w-full py-4 px-0">
                    <div className="container max-w-[1366px] h-full flex items-center justify-between mx-auto">
                        <p className="w-1/3 text-brand text-lg">
                            O'z xizmatingiz haqida hoziroq barcha e'lon qiling!
                        </p>
                        <Link
                            to="/announcements/create/"
                            className="w-fit bg-brand text-white py-1.5 px-3 rounded-md border border-brand hover:bg-transparent hover:text-brand text-center transition-all duration-100 ease-in"
                        >
                            E'lon berish
                        </Link>
                    </div>
                </div>
            )}

            {/* announcements Section */}
            <div className="container mx-auto max-w-[1366px]">
                <div className="flex justify-between items-center py-6 px-5 md:px-0">
                    <div>
                        <h2 className="text-text font-semibold text-3xl">
                            E'lonlar
                        </h2>
                        <p className="text-description">
                            Barchasini bizda toping
                        </p>
                    </div>
                    {workAnnouncement && workAnnouncement[0] && (
                        <Link
                            to={`/announcements/details/${
                                workAnnouncement[0]?.meta || 1
                            }/`}
                            className="border border-border rounded-md py-2 px-4 text-brand hover:bg-brand hover:text-white transition-all duration-100 ease-in"
                        >
                            Ko'proq ko'rish
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 md:px-0">
                    {workAnnouncement && workAnnouncement.length > 0 ? (
                        workAnnouncement.map((value, index) => (
                            <AnnouncementWidget value={value} key={index} />
                        ))
                    ) : (
                        <>
                            <div className="py-12 col-span-full">
                                <p className="text-description font-semibold text-center">
                                    Tizimda ish elonlari yuklangani yo'q
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Services Section */}
            <div className="container mx-auto max-w-[1366px] mb-9">
                <div className="flex justify-between items-center py-6 px-5 md:px-0">
                    <div>
                        <h2 className="text-text font-semibold text-3xl">
                            Xizmatlar
                        </h2>
                        <p className="text-description">
                            Barchasini bizda toping
                        </p>
                    </div>
                    {serviceAnnouncements && serviceAnnouncements[0] && (
                        <Link
                            to={`/announcements/services/details/${
                                serviceAnnouncements[0]?.meta || 1
                            }/`}
                            className="border border-border rounded-md py-2 px-4 text-brand hover:bg-brand hover:text-white transition-all duration-100 ease-in"
                        >
                            Ko'proq ko'rish
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 md:px-0">
                    {serviceAnnouncements && serviceAnnouncements.length > 0 ? (
                        serviceAnnouncements.map((value, index) => (
                            <ServiceWidget value={value} key={index} />
                        ))
                    ) : (
                        <>
                            <div className="py-12 col-span-full">
                                <p className="text-description font-semibold text-center">
                                    Tizimda xizmatlar bo'yicha elonlar
                                    yuklangani yo'q
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
