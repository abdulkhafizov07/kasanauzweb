import api from '@/lib/api'
import { CourseCategory } from '@/types/courses'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export default function CoursesCategoriesWidget() {
  // API fetch
  const fetchData = async (): Promise<
    CourseCategory[] | { results: CourseCategory[] }
  > => {
    const response = await api.get(
      `${import.meta.env.VITE_BACKEND_URL}/courses/api/categories/`,
    )
    return response.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', 'categories'],
    queryFn: fetchData,
    refetchInterval: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Normalize data: support both shapes
  const categories: CourseCategory[] = Array.isArray(data)
    ? data
    : (data?.results ?? [])

  if (error) {
    return <div className="text-red-500">Error loading categories</div>
  }

  return (
    <div className="container max-w-[1366px] relative flex items-center mx-auto px-4 my-4">
      {isLoading ? (
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <>
          <div className="flex items-center justify-start gap-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <div
                key={category.guid}
                className="min-w-fit px-4 py-1.5 bg-gray-200/75 rounded-full"
              >
                <Link
                  to="/courses/category/$meta"
                  params={{ meta: category.meta }}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  {category.title}
                </Link>
              </div>
            ))}
          </div>

          <Link
            to="/courses"
            className="absolute top-0 right-4 block min-w-fit px-3 py-1.5 bg-brand hover:bg-opacity-80 text-white rounded-full cursor-pointer"
          >
            <span>Barcha kategoriyalar</span>
          </Link>
        </>
      ) : (
        <div className="text-gray-500">Kategoriyalar mavjud emas</div>
      )}
    </div>
  )
}
