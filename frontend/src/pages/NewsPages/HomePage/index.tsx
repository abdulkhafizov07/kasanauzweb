import React from "react";

import background from "@/assets/news/background.png";
import poster from "@/assets/news/poster.png";
import { useNewsContext } from "@/context/news";
import { newsApi } from "@/server";
import LoadingComponent from "@/components/web/loader";
import { DateTimeIcon, ViewsIcon } from "@/components/icons/all";
import { normalizeDate } from "@/utils";
import { Link } from "react-router-dom";
import NewsWidget from "@/components/web/news/news";
import DocumentsSection from "@/components/web/news/documents";

export const HomePage: React.FC = () => {
  const { bannerNews, weekNews } = useNewsContext();

  return (
    <>
      <div
        className="relative flex h-32 overflow-hidden justify-between"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#41a584e7] to-[#41a584e7] z-10"></div>
        <div className="container max-w-[1366px] relative z-20 flex items-center mx-auto h-full">
          <div className="text-5xl font-semibold text-white">Yangiliklar</div>
        </div>
        <img
          src={poster}
          alt="Poster"
          className="absolute -top-1/5 right-0 z-10 w-1/2"
        />
      </div>

      <div className="container mx-auto max-w-[1366px] py-12">
        {bannerNews.length > 0 ? (
          <div className="flex items-start justify-start space-x-4">
            <Link
              to={"/news/details/" + bannerNews[0].meta}
              className="relative w-2/3 bg-brand rounded-lg overflow-hidden"
            >
              <div className="w-full aspect-[16/9]">
                <img
                  src={`${newsApi?.replace("/api/", "")}${
                    bannerNews[0].thumbnail
                  }`}
                  alt=""
                />
              </div>

              <div className="absolute top-0 left-0 w-full h-full flex items-end justify-start bg-gradient-to-b from-transparent to-black/70 z-10">
                <div className="content p-8 w-full">
                  <h3 className="text-4xl text-white font-semibold mb-2">
                    {bannerNews[0].title}
                  </h3>
                  <p className="text-lg text-white/80 mb-3">
                    {bannerNews[0].short_description?.split(".")[0]}
                  </p>

                  <div className="flex items-center justify-between space-x-4 w-full">
                    <span className="text-text text-sm bg-white py-1 px-2 rounded-lg">
                      {bannerNews[0].category.title}
                    </span>

                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-white flex items-center justify-center space-x-1">
                        <span className="icon">
                          <DateTimeIcon size={20} />
                        </span>
                        <span className="text">
                          {normalizeDate(bannerNews[0].created_at)}
                        </span>
                      </p>
                      <p className="text-white flex items-center justify-center space-x-1">
                        <span className="icon">
                          <ViewsIcon size={20} />
                        </span>
                        <span className="text">{bannerNews[0].views}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className="w-1/3">
              <div className="flex flex-col space-y-4 items-start justify-start">
                {bannerNews.slice(1).map((news) => (
                  <Link
                    key={news.guid}
                    to={"/news/details/" + news.meta}
                    className="flex items-center justify-center"
                  >
                    <div className="aspect-1/1 w-18 h-18">
                      <img
                        src={`${newsApi?.replace("/api/", "")}${
                          news.thumbnail
                        }`}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="content px-4">
                      <h4 className="text-text text-lg font-semibold mb-2">
                        {news.title}
                      </h4>
                      <div className="flex items-center justify-between space-x-2">
                        <p className="text-brand flex items-center justify-center space-x-1">
                          <span className="icon">
                            <DateTimeIcon />
                          </span>
                          <div className="text">
                            {normalizeDate(news.created_at)}
                          </div>
                        </p>
                        <p className="text-brand flex items-center justify-center space-x-1">
                          <span className="icon">
                            <ViewsIcon />
                          </span>
                          <div className="text">{news.views}</div>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12">
            <p className="text-lg text-center text-description font-semibold">
              Banner uchun yangiliklar yuklangani yo'q
            </p>
          </div>
        )}
      </div>

      <div className="container mx-auto max-w-[1366px] pb-12">
        <div className="section-title mb-4">
          <h3 className="text-3xl font-semibold text-text">
            Qonunchilik yangiliklari
          </h3>
          <p className="text-description">
            So’nggi haftaning eng mashhur mahsulotlari
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {weekNews.length > 1 ? (
            weekNews.map((value, index) => (
              <NewsWidget key={index} news={value} />
            ))
          ) : (
            <div className="py-12 col-span-4">
              <p className="text-lg text-center text-description font-semibold">
                Qonunchilik yangiliklari yuklangani yo'q
              </p>
            </div>
          )}
        </div>
      </div>

      <DocumentsSection />
    </>
  );
};
