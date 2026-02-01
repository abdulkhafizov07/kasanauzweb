import { OnlineShopPoster } from '@/components/web/onlineshop/poster'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const OnlineShopCategoriesWidget = lazy(
  () => import('@/components/web/onlineshop/categories'),
)

const TopProductsSection = lazy(
  () => import('@/components/web/onlineshop/top-products'),
)

const SuccessfulExperienceWidget = lazy(() =>
  import('@/components/web/successful-experience').then((module) => ({
    default: module.SuccessfulExperienceWidget,
  })),
)

export const Route = createFileRoute('/shop/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('online-shop')} - Kasana.UZ`
  }, [t])

  return (
    <>
      <OnlineShopPoster />

      <Suspense fallback={null}>
        <OnlineShopCategoriesWidget />
      </Suspense>

      <Suspense fallback={null}>
        <TopProductsSection />
      </Suspense>

      <Suspense fallback={null}>
        <SuccessfulExperienceWidget />
      </Suspense>
    </>
  )
}
