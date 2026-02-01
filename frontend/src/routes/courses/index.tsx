import { lazy, Suspense, useEffect } from 'react'
import { CoursesPoster } from '@/components/web/courses/poster'
import { createFileRoute } from '@tanstack/react-router'

// Lazy-loaded sections
const CoursesCategoriesWidget = lazy(
  () => import('@/components/web/courses/categories'),
)

const TopCoursesSection = lazy(
  () => import('@/components/web/courses/top-courses'),
)

const SuccessfulExperience = lazy(
  () => import('@/components/web/courses/successfulExperience'),
)

const NewCoursesSection = lazy(
  () => import('@/components/web/courses/new-courses'),
)

const TheHistoryOfSuccess = lazy(
  () => import('@/components/web/courses/theHistoryOfSuccess'),
)

export const Route = createFileRoute('/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Kurslar - Kasana.UZ'
  })

  return (
    <>
      <CoursesPoster />

      <Suspense fallback={null}>
        <CoursesCategoriesWidget />
      </Suspense>

      <Suspense fallback={null}>
        <TopCoursesSection />
      </Suspense>

      <Suspense fallback={null}>
        <SuccessfulExperience />
      </Suspense>

      <Suspense fallback={null}>
        <NewCoursesSection />
      </Suspense>

      <Suspense fallback={null}>
        <TheHistoryOfSuccess />
      </Suspense>
    </>
  )
}
