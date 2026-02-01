import api from '@/lib/api'
import { ProductCategory } from '@/types/onlineshop'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useCallback } from 'react'

export default function OnlineShopCategoriesWidget() {
  const fetchData = useCallback(async (): Promise<ProductCategory[]> => {
    const response = await api.get(`/onlineshop/api/categories/`)
    return response.data
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['shop', 'categories'],
    queryFn: fetchData,
    refetchInterval: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <div className="text-red-500">Kategoriyalarni yuklashda xatolik</div>
  }

  return (
    <div className="container max-w-[1366px] relative flex items-center mx-auto px-4 mt-4">
      {isLoading ? (
        <></>
      ) : data && data.length > 0 ? (
        <>
          <div className="flex items-center justify-start gap-x-2 overflow-scroll scrollbar-hide">
            {data.map((category) => (
              <div
                key={category.guid}
                className="min-w-fit p-3 py-1.5 bg-gray-200/75 rounded-full"
              >
                <Link
                  to="/shop/categories"
                  search={{ selected: [category.meta].join(',') }}
                >
                  {category.title}
                </Link>
              </div>
            ))}
          </div>

          <Link
            to="/shop/categories"
            className="absolute top-0 right-4 block min-w-fit px-3 py-1.5 bg-brand hover:bg-opacity-80 text-white rounded-full cursor-pointer"
          >
            <span>Barcha kategoriyalar</span>
          </Link>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
