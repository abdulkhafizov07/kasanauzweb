import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/web/loader";
import NewsWidget from "@/components/web/news/news";
import { NewsCategory, NewsItem } from "@/types/news";
import banner from "@/assets/news/category-details.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import api from "@/lib/api";

async function fetchCategory(meta: string): Promise<NewsCategory> {
  const res = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/news/api/categories/${meta}/`,
  );
  return res.data;
}

async function fetchCategoryNews(meta: string): Promise<NewsItem[]> {
  const res = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/news/api/categories/${meta}/news/`,
  );
  return res.data || [];
}

export const Route = createFileRoute("/news/categories/$meta")({
  component: RouteComponent,
});

function RouteComponent() {
  const { meta } = useParams({ from: "/news/categories/$meta" });

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["news-category", meta],
    queryFn: () => fetchCategory(meta),
  });

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
      <div className="bg-brand">
        <div className="container mx-auto max-w-[1366px] p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-gray-100 hover:text-white text-[16px]"
                >
                  <Link to="/">Bosh sahifa</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-gray-100 hover:text-white text-[16px]"
                >
                  <Link to="/news">Yangiliklar</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white text-[16px]">
                  {category.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="banner w-full h-18 relative bg-white">
        <div className="container mx-auto max-w-[1366px] flex items-center h-full px-4">
          <h3 className="text-3xl font-semibold text-brand">
            {category.title}
          </h3>
        </div>
        <img
          src={banner}
          alt={"Image for " + category.title}
          className="absolute right-0 top-0 h-18"
        />
      </div>

      <div className="container mx-auto max-w-[1366px] p-4">
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
