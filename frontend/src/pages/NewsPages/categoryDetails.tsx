// routes/news/categories/$meta.tsx
"use client";

import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import LoadingComponent from "@/components/web/loader";
import NewsWidget from "@/components/web/news/news";
import { newsApi } from "@/server";
import { NewsCategory, NewsItem } from "@/types/news";
import banner from "@/assets/news/category-details.png";

// 🚀 API fetchers
async function fetchCategory(meta: string): Promise<NewsCategory> {
  const res = await axios.get(`${newsApi}categories/${meta}/`);
  return res.data;
}

async function fetchCategoryNews(meta: string): Promise<NewsItem[]> {
  const res = await axios.get(`${newsApi}category/${meta}/`);
  return res.data.results || [];
}

export const Route = createFileRoute("/news/categories/$meta")({
  component: RouteComponent,
});

function RouteComponent() {
  const { meta } = useParams({ from: "/news/categories/$meta" });

  // fetch category
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["news-category", meta],
    queryFn: () => fetchCategory(meta),
  });

  // fetch news for that category
  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ["news-category-news", meta],
    queryFn: () => fetchCategoryNews(meta),
  });

  if (categoryLoading || newsLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-148px)] flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="w-full min-h-[calc(100vh-148px)] flex items-center justify-center">
        <p className="text-red-500">Kategoriya topilmadi</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Banner */}
      <div className="banner w-full h-18 relative bg-white">
        <div className="container mx-auto max-w-[1366px] flex items-center h-full">
          <h3 className="text-3xl font-semibold text-brand">{category.title}</h3>
        </div>
        <img
          src={banner}
          alt={"Image for " + category.title}
          className="absolute right-0 top-0 h-18"
        />
      </div>

      {/* News grid */}
      <div className="container mx-auto max-w-[1366px] py-4">
        <div className="grid grid-cols-4 gap-4">
          {news?.length ? (
            news.map((value, index) => <NewsWidget news={value} key={index} />)
          ) : (
            <p>Yangiliklar topilmadi</p>
          )}
        </div>
      </div>
    </div>
  );
}
