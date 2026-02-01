import React, { useRef, useState, type JSX } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { BoxIcon } from "lucide-react";

interface Slide {
    heroText: string | JSX.Element;
    description: string;
    name: string;
    job: string;
    peopleImg: string;
    srcSet: string;
    sizes: string;
}

const HeroSection: React.FC = () => {
    const slides: Slide[] = [
        {
            heroText: (
                <>
                    {" "}
                    <span className="text-brand">
                        Kasanachilikni rivojlantirish
                    </span>{" "}
                    bu sohada yangi imkoniyatlar yaratishdir{" "}
                </>
            ),
            description: "Loyiha haqida ko'proq ma'lumot...",
            name: "Adhamjon Soliyev",
            job: "Kasanchi, usta",
            peopleImg: "/assets/hero/image1_720p.webp",
            srcSet: "/assets/hero/image1_480p.webp 360w, /assets/hero/image1_720p.webp 390w",
            sizes: "(max-width: 480px) 360px, 390px",
        },
        {
            heroText: (
                <>
                    {" "}
                    <span className="text-brand">
                        Kasanachilikni rivojlantirish
                    </span>{" "}
                    bu sohada yangi imkoniyatlar yaratishdir{" "}
                </>
            ),
            description: "Loyiha haqida ko'proq ma'lumot...",
            name: "Mubina Ismatjonova",
            job: "Kasanchi, tikuvchi",
            peopleImg: "/assets/hero/image2_720p.webp",
            srcSet: "/assets/hero/image2_480p.webp 274w, /assets/hero/image2_720p.webp 411w",
            sizes: "(max-width: 480px) 274px, 411px",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);

    return (
        <section
            id="hero"
            className="relative w-full bg-bg-placeholder overflow-hidden"
        >
            <div className="image absolute top-0 left-0 w-full h-full">
                <img
                    src="/assets/hero/background-720.webp"
                    srcSet="
    /assets/hero/background-480.webp 480w,
    /assets/hero/background-720.webp 720w,
    /assets/hero/background-1080.webp 1080w
  "
                    sizes="(max-width: 480px) 480px, (max-width: 720px) 720px, 1080px"
                    alt="Background image"
                    className="h-full object-cover"
                    loading="lazy"
                />
            </div>
            <div
                className="container mx-auto max-w-[1366px] min-h-fit lg:min-h-screen flex items-end pt-44 pb-0 lg:pb-12 md:px-4"
                data-aos="fade-up"
            >
                <Swiper
                    modules={[Pagination, EffectFade, Autoplay]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    className="hero-swiper"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col lg:flex-row items-center justify-between">
                                <div className="w-2/3 h-full">
                                    <h1 className="text-4xl lg:text-3xl font-bold text-text">
                                        {slide.heroText}
                                    </h1>
                                    <p className="text-description w-3/4 mt-4">
                                        {slide.description}
                                    </p>

                                    <div className="relative flex items-center gap-4 mt-6">
                                        <Button asChild size={"lg"}>
                                            <Link to={"/news"}>Batafsil</Link>
                                        </Button>

                                        <Button
                                            variant={"ghost"}
                                            size={"lg"}
                                            asChild
                                            className={cn(
                                                "bg-white text-brand hover:text-brand"
                                            )}
                                        >
                                            <Link to={"/shop"}>
                                                <span className="text">
                                                    Mahsulotlar
                                                </span>
                                                <span className="icon">
                                                    <BoxIcon />
                                                </span>
                                            </Link>
                                        </Button>

                                        <div className="hero-swiper-pagination hidden lg:flex gap-1.5">
                                            {slides.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        swiperRef.current?.slideToLoop(
                                                            index
                                                        )
                                                    }
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                        activeIndex === index
                                                            ? "bg-brand"
                                                            : "bg-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="ident absolute right-0 top-0 hidden md:flex flex-col items-end justify-center gap-0.5">
                                            <span className="bg-[#77F9DA4D] text-brand text-lg px-4 py-2 rounded-xl">
                                                {slide.name}
                                            </span>
                                            <span className="bg-[#B7B7B726] text-text px-2.5 py-1 rounded-full">
                                                {slide.job}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/3 h-[420px] xl:h-[520px] flex justify-center items-end">
                                    <div className="aspect-[3/4] h-full relative">
                                        <img
                                            src={slide.peopleImg}
                                            srcSet={slide.srcSet}
                                            sizes={slide.sizes}
                                            alt={slide.name}
                                            className="h-full object-contain"
                                            loading="eager"
                                            fetchPriority="high"
                                        />

                                        <div className="w-66 h-66 bg-brand rounded-full absolute top-1/2 left-1/2 -z-10 -translate-1/2"></div>
                                        <div className="w-42 h-42 bg-brand/10 backdrop-blur-xl rounded-full absolute top-8 right-0 -z-10"></div>
                                        <div className="w-36 h-36 bg-brand/10 backdrop-blur-xl rounded-full absolute top-1/2 left-0 -z-10 -translate-y-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default HeroSection;
