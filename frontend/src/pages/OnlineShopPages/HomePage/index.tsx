import React from "react";
import { useTranslation } from "react-i18next";

import backgroundImg from "./backgroundImg.png";
import img from "./posterImg.png";

import TopProducts from "@/components/TopProductsComponent/index";
import News from "@/components/NewsFromWorkersComponent";
import Offers from "@/components/OffersComponent/index";
import Success from "@/components/SuccessComponent/index";
import SuccessfulExperience from "@/components/web/courses/successfulExperience";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = `${t("Online shop")} - Kasana.UZ`;
  }, [t]);

  return (
    <>
      <div
        className="relative flex h-32 overflow-hidden justify-between mb-4"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#41a584e7] to-[#41a584e7] z-10"></div>
        <div className="container max-w-[1366px] relative z-20 flex items-center mx-auto h-full px-4">
          <div className="text-4xl font-semibold text-white">
            Kasanachilik onlayn bozori
          </div>
        </div>
        <img
          src={img}
          alt="Poster"
          className="absolute -top-1/8 left-1/2 z-10 w-1/3"
        />
      </div>

      {/* Top Products */}
      <TopProducts />

      {/* Shop Swiper */}
      {/* <ShopSwiper /> */}

      <SuccessfulExperience />

      {/* News From Workers */}
      <News />

      {/* Cubes Section */}
      {/* <div className="py-8 my-9 bg-[#f5f5f5]">
        <div className="max-w-[1366px] mx-auto flex flex-wrap justify-between gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-[200px] h-[200px] rounded-md bg-brand"
            ></div>
          ))}
        </div>
      </div> */}

      {/* Offers Section */}
      <Offers />

      {/* Success Section */}
      <Success />
    </>
  );
};

export default HomePage;
