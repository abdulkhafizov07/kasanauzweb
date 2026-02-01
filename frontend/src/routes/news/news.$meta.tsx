import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '@/components/web/loader'
import { normalizeDate } from '@/utils'
import { NewsItem } from '@/types/news'
import { RightSide } from '@/components/web/news/rightside'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@tanstack/react-router'
import api from '@/lib/api'
import { lazy, Suspense } from 'react'
import { CalendarDaysIcon, EyeIcon, FolderIcon } from 'lucide-react'

export const Route = createFileRoute('/news/news/$meta')({
  component: RouteComponent,
})

const SuccessfulExperience = lazy(
  () => import('@/components/web/courses/successfulExperience'),
)

async function fetchNews(meta: string): Promise<NewsItem> {
  const res = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/news/api/news/${meta}/`,
  )
  return res.data
}

function RouteComponent() {
  const { meta } = useParams({ from: '/news/news/$meta' })

  const {
    data: newsItem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['news', meta],
    queryFn: () => fetchNews(meta),
  })

  if (isLoading) return <LoadingComponent />
  if (isError || !newsItem)
    return <p>Xatolik yuz berdi yoki yangilik topilmadi</p>

  return (
    <div className="w-full h-full bg-white">
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
                  {newsItem.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto max-w-[1366px] py-3">
        <div className="flex space-x-3 items-start justify-start">
          <div className="bg-white p-3 rounded-lg w-2/3">
            <div className="aspect-[16/9]">
              <img
                src={newsItem.thumbnail}
                alt={newsItem.title}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>

            <div className="w-full flex items-center justify-center h-full mt-4 space-x-4">
              <p className="text-description flex items-center justify-center space-x-1">
                <span className="icon">
                  <CalendarDaysIcon />
                </span>
                <span className="text">
                  {normalizeDate(newsItem.created_at)}
                </span>
              </p>

              <Link
                to="/news/categories/$meta"
                params={{ meta: newsItem.category.meta }}
                className="min-w-fit text-description flex items-center justify-center space-x-1"
              >
                <span className="icon">
                  <FolderIcon />
                </span>
                <span className="text">{newsItem.category.title}</span>
              </Link>

              <p className="text-text flex items-center justify-center space-x-1">
                <span className="icon">
                  <EyeIcon />
                </span>
                <span className="text">{newsItem.views}</span>
              </p>

              <span className="w-full"></span>
              {newsItem.user && (
                <div className="flex items-center justify-center min-w-fit space-x-2">
                  <img
                    src={newsItem.user.pfp}
                    alt={newsItem.user.first_name}
                    className="w-6 h-6"
                  />
                  <span className="text-description">
                    {newsItem.user.first_name} {newsItem.user.last_name}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mt-3">
              <h1 className="text-3xl font-bold">{newsItem.title}</h1>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    newsItem.description.replaceAll('\n', '</br>') ||
                    newsItem.short_description?.replaceAll('\n', '</br>') ||
                    '',
                }}
                className="lg:max-w-[1024px] text-description"
              ></p>
            </div>
          </div>

          <div className="sticky top-26 w-1/3">
            <RightSide />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <SuccessfulExperience />
      </Suspense>
    </div>
  )
}
