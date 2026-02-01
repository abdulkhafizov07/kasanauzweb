import Loading from '@/components/web/loader'
import { ProductType } from '@/types/onlineshop'
import { ProductWidget } from '@/components/web/onlineshop/product'
import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function TopProductsSection() {
  const fetchData = async ({
    pageParam = 1,
  }): Promise<{
    results: ProductType[]
    page: number
    limit: number
    total: number
  }> => {
    const response = await api.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/onlineshop/api/top-products/?page=${pageParam}&page_size=8`,
    )
    return response.data
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['shop', 'top-products'],
      queryFn: fetchData,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1
        const totalPages = Math.ceil(lastPage.total / lastPage.limit)
        return nextPage <= totalPages ? nextPage : undefined
      },
    })

  if (isLoading) {
    return (
      <section id="top-products">
        <div className="py-16 flex justify-center">
          <Loading />
        </div>
      </section>
    )
  }

  return (
    <section id="top-products" className="mb-6 md:mb-0">
      <div className="container mx-auto max-w-[1366px] mt-6 px-4">
        <div className="text-3xl font-semibold text-[#1e1e1e]">
          Bozori chaqqon mahsulotlar 🔥
        </div>
        <div className="text-description mt-1">
          So’nggi haftaning eng mashhur mahsulotlari
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {data?.pages.flatMap((page) =>
            page.results.map((product, index) => (
              <ProductWidget
                product={product}
                key={`${product.guid}-${index}`}
              />
            )),
          )}
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 text-brand border border-gray-200 hover:bg-gray-100 rounded-lg text-base transition cursor-pointer"
            >
              {isFetchingNextPage ? 'Yuklanmoqda...' : "Ko'proq ko'rish"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
