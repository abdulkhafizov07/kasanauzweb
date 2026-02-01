import LoadingComponent from "@/components/web/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { CalendarIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/lib/api";

const NewsListSkeleton: React.FC = () => (
    <div className="w-full flex justify-start items-start gap-2">
        <Skeleton className="h-22 aspect-square" />
        <div className="w-full space-y-2">
            <Skeleton className="w-4/5 h-8" />
            <div className="space-y-0.5">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-2/5 h-5" />
            </div>
        </div>
    </div>
);

interface NewsItem {
    meta: string; // slug
    title: string;
    short_description: string;
    thumbnail: string;
    created_at: string;
    category: {
        title: string;
        meta: string;
    };
}

const fetchNews = async (): Promise<NewsItem[]> => {
    const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/news/api/home/`
    );
    return res.data || [];
};

export const NewsSlideWidget: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const slideDuration = 5000;

    const { data: news = [], isLoading } = useQuery({
        queryKey: ["latest_news"],
        queryFn: fetchNews,
        staleTime: 1000 * 60, // cache for 1 min
        refetchOnWindowFocus: false,
    });

    const handleAutoplayTimeLeft = (_swiper: any, time: number) => {
        setProgress(1 - time / slideDuration);
    };

    return (
        <div className="container max-w-[1366px] mx-auto px-4 mt-8 mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* SLIDER */}
                <div className="lg:col-span-2 aspect-[16/10] rounded-xl overflow-hidden">
                    {isLoading ? (
                        <Skeleton className="w-full h-full">
                            <LoadingComponent />
                        </Skeleton>
                    ) : (
                        <Swiper
                            className="bg-brand"
                            modules={[Navigation, Pagination, Autoplay]}
                            loop
                            autoplay={{ delay: slideDuration }}
                            onAutoplayTimeLeft={handleAutoplayTimeLeft}
                            onSlideChange={(swiper) =>
                                setActiveIndex(swiper.realIndex)
                            }
                        >
                            {news.map((item) => (
                                <SwiperSlide
                                    key={item.meta}
                                    className="aspect-[16/10]"
                                >
                                    <Link
                                        to="/news/news/$meta"
                                        params={{ meta: item.meta }}
                                        className="relative"
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="h-full w-full object-cover z-0"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-0 left-0 flex w-full h-full items-end bg-gradient-to-b from-transparent from-20% to-black/85 to-80% z-10">
                                            <div className="absolute w-10 h-10 flex items-center justify-center top-4 right-4 bg-black/20 backdrop-blur-3xl rounded-lg">
                                                <svg
                                                    className="w-6 h-6"
                                                    viewBox="0 0 36 36"
                                                >
                                                    <circle
                                                        className="text-black/50"
                                                        strokeWidth="6"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        cx="18"
                                                        cy="18"
                                                        r="14"
                                                    />
                                                    <circle
                                                        className="text-white"
                                                        strokeWidth="6"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        cx="18"
                                                        cy="18"
                                                        r="14"
                                                        strokeDasharray="100"
                                                        strokeDashoffset={
                                                            100 - progress * 100
                                                        }
                                                        strokeLinecap="round"
                                                        transform="rotate(-90 18 18)"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="content p-8 w-full">
                                                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted text-sm md:text-lg mb-2">
                                                    {item.short_description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm md:text-normal py-1 px-3 bg-white text-black rounded-lg">
                                                        {item.category?.title}
                                                    </span>

                                                    <div className="flex items-center justify-center space-x-4">
                                                        <div className="text-sm text-white flex items-center space-x-1">
                                                            <CalendarIcon
                                                                size={18}
                                                            />
                                                            <span>
                                                                {new Date(
                                                                    item.created_at
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-white flex items-center space-x-1">
                                                            <EyeIcon
                                                                size={18}
                                                            />
                                                            <span>—</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                {/* SIDE LIST */}
                <div className="hidden lg:block col-span-1 space-y-4">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                              <NewsListSkeleton key={i} />
                          ))
                        : news.map((item, index) => (
                              <Link
                                  key={item.meta}
                                  to="/news/news/$meta"
                                  params={{ meta: item.meta }}
                                  className="block"
                              >
                                  <div
                                      className={`w-full flex justify-start items-start gap-2 rounded-lg transition-all ease-in duration-400 ${
                                          index === activeIndex
                                              ? "bg-muted border-r-4 border-brand p-2"
                                              : ""
                                      }`}
                                  >
                                      <div className="h-22 aspect-square">
                                          <img
                                              className="h-full object-cover rounded-lg"
                                              src={item.thumbnail}
                                              alt={item.title}
                                          />
                                      </div>
                                      <div className="w-full space-y-2">
                                          <h3 className="text-xl font-bold line-clamp-1 mb-0.5">
                                              {item.title}
                                          </h3>
                                          <p className="font-normal text-description line-clamp-2">
                                              {item.short_description}
                                          </p>
                                      </div>
                                  </div>
                              </Link>
                          ))}
                </div>
            </div>
        </div>
    );
};
