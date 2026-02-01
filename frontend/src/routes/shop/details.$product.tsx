import api from '@/lib/api'
import LoadingComponent from '@/components/web/loader'
import { Button } from '@/components/ui/button'
import CommentsWidget from '@/components/web/onlineshop/comments'
import { useAuth } from '@/context/auth'
import { ProductImage, ProductType } from '@/types/onlineshop'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { ThumbsUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/shop/details/$product')({
  component: RouteComponent,
})

function RouteComponent() {
  const { product: productMeta } = useParams({
    from: '/shop/details/$product',
  })
  const [mainImage, setMainImage] = useState(0)
  const [selectedDep, setSelectedDep] = useState('tarriff')
  const [isProductLiked, setIsProductLiked] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['onlineshop', 'products', productMeta],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/onlineshop/api/product/${productMeta}/`,
        )

        return response.data
      } catch (err) {}
    },
  })

  const product: ProductType | undefined = data?.product
  const images: ProductImage[] | undefined =
    data?.product?.onlineshop_app_product_images

  const { data: isProductLikedData } = useQuery({
    queryKey: ['onlineshop', 'products', productMeta, 'liked'],
    queryFn: async () => {
      const response = await api.post(
        `/onlineshop/api/profile/is-product-liked/`,
        { guid: data.product.guid }, // guid is inside product
      )
      return response.data
    },
    enabled: !!(isAuthenticated && data?.product?.guid),
    retry: false, // optional: don’t retry if unauthorized
  })

  useEffect(() => {
    if (isProductLikedData) {
      setIsProductLiked(isProductLikedData.isProductLiked)
    }
  }, [isProductLikedData])

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div id="product-details">
      <div className="container mx-auto max-w-[1366px] px-4">
        <div className="h-full grid grid-cols-2 gap-4 mt-8">
          <div className="images-container">
            {images && images.length >= 1 && images[mainImage]?.image ? (
              <div className="images flex items-start justify-center gap-4 space-x-2">
                <div className="vertical-images flex flex-col space-y-4 min-w-16">
                  {images.map((image, index) => (
                    <div
                      className={
                        'aspect-square w-18 cursor-pointer border border-[#D9D9D9] rounded-lg transition-all duration-300 ease-in ' +
                        String(
                          image === images[mainImage]
                            ? 'ring-3 ring-offset-1 ring-brand'
                            : '',
                        )
                      }
                      key={index}
                      onClick={() => setMainImage(index)}
                    >
                      <img
                        src={image.image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="hero-image w-full">
                  <div className="aspect-square w-full rounded-lg ring-2 ring-offset-1 ring-border overflow-hidden">
                    <img
                      src={images[mainImage]?.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="images"></div>
            )}
          </div>

          {product && (
            <div className="content flex flex-col justify-between">
              <div className="flex items-start w-full flex-col">
                <h3 className="text-3xl font-bold text-text mb-2">
                  {product.title}
                </h3>
                <div className="text-2xl font-medium text-text mb-1">
                  O'lcham va tavsifi
                </div>
                <p className="text-description font-[16px] mb-2">
                  {product.short_description}
                </p>
              </div>

              <div className="flex w-full h-auto p-3 justify-between items-center bg-background border border-border rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <div className="aspect-square w-9 h-9 rounded-full overflow-hidden ring-2 ring-offset-1 ring-brand">
                    <img
                      src={product.user.pfp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-2">
                    <div className="text-lg font-bold text-text mb-0">
                      {product.user.first_name} {product.user.last_name}
                    </div>
                    <div className="text-sm text-description">
                      {product.user.purposes.split(',')[0]}
                    </div>
                  </div>
                </div>
                {isAuthenticated ? (
                  <div className="flex items-center justify-center">
                    <Button
                      className="py-2 px-3 bg-brand text-white text-[16px] font-semibold rounded-lg ring-offset-1 ring-brand/80 transition-all duration-300 ease-in hover:ring-3"
                      onClick={() => {
                        api
                          .post(
                            `${
                              import.meta.env.VITE_BACKEND_URL
                            }/town/messages/chats/create/`,
                            {
                              type: 'product',
                              content: product?.guid,
                            },
                          )
                          .then(() => {
                            navigate({
                              to: '/profile/messenger',
                            })
                          })
                      }}
                    >
                      Bog'lanish
                    </Button>

                    <button
                      type="button"
                      className="flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer"
                      onClick={() => {
                        api
                          .post(
                            `${
                              import.meta.env.VITE_BACKEND_URL
                            }/onlineshop/api/profile/like-product/`,
                            { guid: product.guid },
                          )
                          .then(({ data }) => {
                            setIsProductLiked(data.liked)
                          })
                      }}
                    >
                      <span
                        className={
                          'icon' + (isProductLiked ? ' text-brand' : '')
                        }
                      >
                        <ThumbsUpIcon size={16} />
                      </span>
                    </button>
                  </div>
                ) : (
                  <Button asChild>
                    <Link to="/auth/login">Kirish</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center space-x-0">
              <div className="choice min-w-fit">
                <input
                  type="radio"
                  name="dep"
                  id="tarriff"
                  checked={selectedDep === 'tarriff'}
                  onChange={() => {
                    setSelectedDep('tarriff')
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="tarriff"
                  className={`flex items-center justify-center space-x-1 py-2 px-3 transition-all duration-300 ease-out border-b-2 ${
                    selectedDep === 'tarriff' ? 'border-brand' : 'border-border'
                  }`}
                >
                  <span className="icon">
                    {/* <ProductDetailsIcon size={20} /> */}
                  </span>
                  <span className="text">Mahsulot tarifi</span>
                </label>
              </div>

              <div className="choice min-w-fit">
                <input
                  type="radio"
                  name="dep"
                  id="datas"
                  checked={selectedDep === 'datas'}
                  onChange={() => {
                    setSelectedDep('datas')
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="datas"
                  className={`flex items-center justify-center space-x-1 py-2 px-3 transition-all duration-300 ease-out border-b-2 ${
                    selectedDep === 'datas' ? 'border-brand' : 'border-border'
                  }`}
                >
                  <span className="icon">{/* <ProductCommentsIcon /> */}</span>
                  <span className="text">Fikrlar</span>
                </label>
              </div>
              <div className="border-b-2 border-border w-full h-10.5"></div>
            </div>

            <div className="tab-container">
              <div
                className={`datas-container py-4 ${
                  selectedDep === 'tarriff' ? '' : 'hidden'
                }`}
              >
                {/* <ReactMarkDown>
                                    {product.description}
                                </ReactMarkDown> */}
              </div>
              <div
                className={`datas-container ${
                  selectedDep === 'datas' ? '' : 'hidden'
                }`}
              >
                {product && <CommentsWidget product={product} />}
              </div>
            </div>
          </div>
        </div>

        <div className="similar mb-4">
          <h3 className="text-3xl font-semibold text-text">
            O'xshash mahsulotlar
          </h3>
          <div className="text-md text-description">
            Yangi mahsulotlarni sinab ko'ring!
          </div>
          <div className="grid grid-cols-4 space-x-3 mt-3">
            {/* {similarProducts.map((value, index) => (
                            <ProductWidget product={value} key={index} />
                        ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}
