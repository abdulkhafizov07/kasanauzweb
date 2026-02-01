import { useInfiniteQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import NewsWidget from '@/components/web/news/news'
import api from '@/lib/api'
import { NewsItem } from '@/types/news'
import { useNavigate } from '@tanstack/react-router'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export default function WeeklyNews() {
  const navigate = useNavigate()

  // API call
  const fetchWeeklyNews = async ({
    pageParam = 1,
  }): Promise<PaginatedResponse<NewsItem>> => {
    const res = await api.get(
      `${import.meta.env.VITE_BACKEND_URL}/news/api/weekly/?page=${pageParam}`,
    )
    return res.data
  }

  // Infinite query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['weekly_news'],
    queryFn: fetchWeeklyNews,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      return url.searchParams.get('page') ?? undefined
    },
  })

  // Flatten all pages
  const allNews = data?.pages.flatMap((page) => page.results) ?? []

  // Load more logic
  const handleLoadMore = () => {
    if (data?.pages.length && data.pages.length >= 3) {
      navigate({ to: '/news' })
    } else {
      fetchNextPage()
    }
  }

  return (
    <div className="container mx-auto max-w-[1366px] pb-12 px-4">
      <div className="section-title mb-4">
        <h3 className="text-3xl font-semibold text-text">
          Qonunchilik yangiliklari
        </h3>
        <p className="text-description">
          So’nggi haftaning eng mashhur mahsulotlari
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading && allNews.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="w-full h-[250px] rounded-lg" />
          ))}
        </div>
      ) : isError || allNews.length === 0 ? (
        // Error / Empty
        <div className="py-12 col-span-4">
          <p className="text-lg text-center text-description font-semibold">
            Qonunchilik yangiliklari yuklangani yo‘q
          </p>
        </div>
      ) : (
        <>
          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allNews.map((newsItem, index) => (
              <NewsWidget key={index} news={newsItem} />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Yuklanmoqda...' : 'Ko‘proq yuklash'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
