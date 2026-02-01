import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

import HeroSection from '@/components/web/home/hero'

// Lazy-loaded components
const AboutComponent = lazy(() => import('@/components/aboutHomePage'))
const OpportunitiesComponent = lazy(
  () => import('@/components/opportunitiesHomePage'),
)
const DocumentsComponent = lazy(() => import('@/components/documentsHomePage'))
const CoursesComponent = lazy(() => import('@/components/coursesHomePage'))
const PresidentComponent = lazy(() => import('@/components/web/home/president'))
const SuccessComponent = lazy(() => import('@/components/web/home/success'))
const WeeklyNews = lazy(() => import('@/components/web/news/week-news'))

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      {/* Eagerly rendered Hero */}
      <HeroSection />

      {/* Lazy-loaded sections with null fallback */}
      <Suspense fallback={null}>
        <AboutComponent />
      </Suspense>

      <Suspense fallback={null}>
        <OpportunitiesComponent />
      </Suspense>

      <Suspense fallback={null}>
        <DocumentsComponent />
      </Suspense>

      <Suspense fallback={null}>
        <CoursesComponent />
      </Suspense>

      <Suspense fallback={null}>
        <PresidentComponent />
      </Suspense>

      <Suspense fallback={null}>
        <SuccessComponent />
      </Suspense>

      <div className="bg-muted pt-4">
        <Suspense fallback={null}>
          <WeeklyNews />
        </Suspense>
      </div>
    </>
  )
}
