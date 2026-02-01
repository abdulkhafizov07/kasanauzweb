import { NewsPoster } from '@/components/web/news/poster'
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'

const NewsSlideWidget = lazy(() =>
  import('@/components/web/news/news-slide').then((module) => ({
    default: module.NewsSlideWidget,
  })),
)

const SuccessfulExperience = lazy(
  () => import('@/components/web/courses/successfulExperience'),
)
const WeeklyNewsWidget = lazy(() => import('@/components/web/news/week-news'))
const DocumentsSection = lazy(() => import('@/components/web/home/documents'))

export const Route = createFileRoute('/news/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Yangiliklar - Kasana.UZ'
  })

  return (
    <>
      <NewsPoster />

      <Suspense fallback={null}>
        <NewsSlideWidget />
      </Suspense>

      <Suspense fallback={null}>
        <WeeklyNewsWidget />
      </Suspense>

      <Suspense fallback={null}>
        <SuccessfulExperience />
      </Suspense>

      <Suspense fallback={null}>
        <DocumentsSection />
      </Suspense>
    </>
  )
}
