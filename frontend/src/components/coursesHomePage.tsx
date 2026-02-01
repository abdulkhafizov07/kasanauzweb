import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Container } from './ui/container'
import { useTranslation } from 'react-i18next'
import CourseCardComponent from './courseCard'
import { useCallback } from 'react'
import { v2Update_BasicDisplayCourseType } from '@/types/course'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import LoadingComponent from './loader'
import { useInView } from 'react-intersection-observer'

export default function CoursesHomePageComponent() {
  const { t } = useTranslation()
  const { inView, ref } = useInView({ threshold: 0, triggerOnce: true })

  const fetchCourses = useCallback(async (): Promise<
    v2Update_BasicDisplayCourseType[]
  > => {
    const request = await api.get(`/courses/api/new/?page=1&page_size=4`)
    return request.data.results
  }, [])

  const {
    data: courses,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['home-page', 'courses-section'],
    queryFn: fetchCourses,
    enabled: inView,
  })

  return (
    <>
      <section id="courses-home-page">
        <Container
          className="py-12"
          variant="constrainedBreakpointPadded"
          ref={ref}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold">{t('our-courses')}</h2>

            <Button asChild variant="outline">
              <Link to="/courses">{t('see-more')}</Link>
            </Button>
          </div>

          {isLoading && <LoadingComponent />}

          {isSuccess && (
            <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {courses.slice(0, 4).map((value, index) => (
                <CourseCardComponent course={value} key={index} />
              ))}
            </div>
          )}

          {isError && (
            <div>
              <p>Malumotlarni yuklab olishda xatolik yuz berdi</p>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
