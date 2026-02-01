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

export default function TopCoursesSection() {
  const navigate = useNavigate()

  const fetchTopCourses = useCallback(
    async ({ pageParam = 1 }): Promise<PaginatedResponse<CourseType>> => {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/courses/api/top/?page=${pageParam}`,
      )
      return res.data
    },
    [],
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['courses', 'top'],
      queryFn: fetchTopCourses,
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

  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-[1366px] px-4">
        <div className="section-title mb-4">
          <h3 className="title text-4xl font-bold mb-1">Top kurslar</h3>
          <p className="subtitle text-lg text-text-placeholder">
            Yuqori baholangan kurslar
          </p>
        </div>

        <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {allCourses.length > 0 ? (
            allCourses.map((course) => (
              <CourseWidget key={course.guid} course={course} />
            ))
          ) : (
            <p>Top kurslar mavjud emas.</p>
          )}
        </div>

        {/* ✅ show button only if there are courses AND at least one more page */}
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
