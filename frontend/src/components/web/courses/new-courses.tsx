import { useInfiniteQuery } from '@tanstack/react-query'
import CourseWidget from '@/components/web/courses/course'
import { useNavigate } from '@tanstack/react-router'
import api from '@/lib/api'
import { CourseType } from '@/types/courses'
import { useCallback } from 'react'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export default function NewCoursesSection() {
  const navigate = useNavigate()

  const fetchData = useCallback(
    async ({ pageParam = 1 }): Promise<PaginatedResponse<CourseType>> => {
      const res = await api.get(`/courses/api/new/?page=${pageParam}`)
      return res.data
    },
    [],
  )

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['courses', 'new'],
    queryFn: fetchData,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.next) return undefined
      if (pages.length >= 3) return undefined
      const url = new URL(lastPage.next)
      return url.searchParams.get('page')
    },
  })

  const allCourses = data?.pages.flatMap((page) => page.results) ?? []

  const handleLoadMore = () => {
    if (data?.pages.length >= 3) {
      navigate({ to: '/courses' })
    } else {
      fetchNextPage()
    }
  }

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (isError) return <p>Xatolik yuz berdi</p>

  return (
    <section className="new-courses w-full">
      <div className="container mx-auto max-w-[1366px] px-4">
        <div className="section-title mb-4">
          <h3 className="title text-4xl font-bold mb-1">Yangi kurslar</h3>
          <p className="subtitle text-lg text-text-placeholder">
            Yangi yo‘nalishlarni o‘rganing
          </p>
        </div>

        <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {allCourses.length > 0 ? (
            allCourses.map((course) => (
              <CourseWidget key={course.guid} course={course} />
            ))
          ) : (
            <p>Yangi kurslar mavjud emas.</p>
          )}
        </div>

        {/* ✅ show only if there are courses AND more pages */}
        {allCourses.length > 0 && hasNextPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="px-4 py-2 border border-sm-border text-brand font-semibold rounded-lg hover:text-white hover:bg-brand transition-colors duration-300 ease-out disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Yuklanmoqda...' : 'Ko‘proq ko‘rish'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
