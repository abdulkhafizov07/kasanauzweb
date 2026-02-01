import React from "react";

export const CoursesPoster: React.FC = () => {
    return (
        <>
            <div className="aspect-[32/10] md:aspect-[32/5] w-full flex justify-between relative overflow-hidden">
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#41a584e7] to-[#41a584e7]"></div>
                <img
                    src="/assets/theme-background.png"
                    alt="Background"
                    className="absolute w-full h-auto -top-1/2 left-0 opacity-5"
                    decoding="async"
                    fetchPriority="high"
                />

                <div className="relative z-30 container mx-auto max-w-[1366px] px-4">
                    <div className="h-full flex items-center text-5xl font-semibold text-white pl-5 md:pl-0">
                        Kurslar
                    </div>
                </div>

                <div className="absolute z-20 bottom-0 right-0 aspect-[32/10] md:aspect-[32/5] w-full">
                    <img
                        src="/assets/courses/poster_720.webp"
                        srcSet="
    /assets/courses/poster_480.webp 480w,
    /assets/courses/poster_720.webp 720w
  "
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt=""
                        className="h-full md:w-1/2 md:h-auto float-end"
                        decoding="async"
                        fetchPriority="high"
                    />
                </div>
            </div>
        </>
    );
};
