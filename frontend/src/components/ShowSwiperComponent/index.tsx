import React from "react";
import shopSwiper1 from "./swiperImg1.png";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ShopSwiper: React.FC = () => {
  return (
    <div className="px-[30px] py-5 max-w-[1366px] mx-auto" id="shopSwiper">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={6}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="flex w-full"
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3, spaceBetween: 0 },
          840: { slidesPerView: 4, spaceBetween: 0 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
          1200: { slidesPerView: 6, spaceBetween: 30 },
          1400: { slidesPerView: 7 },
        }}
      >
        {[...Array(11)].map((_, index) => (
          <SwiperSlide key={index} className="!opacity-100 w-full">
            <div className="relative w-full h-[70px] rounded-[15px] overflow-hidden">
              <div className="absolute inset-0 bg-[#0f1626a2] z-20 rounded-[15px]"></div>
              <img
                src={shopSwiper1}
                alt="#temirchilik"
                className="absolute inset-0 w-full h-full object-cover rounded-[15px]"
              />
              <span className="z-30 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[17px]">
                #temirchilik
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ShopSwiper;
