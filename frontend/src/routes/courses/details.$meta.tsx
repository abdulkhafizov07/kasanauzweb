import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LoadingComponent from '@/components/web/loader'
import { normalizeDate } from '@/utils'
import { CourseType, LessonType } from '@/types/courses'
import { CalendarIcon, EyeIcon, FolderIcon, HeartIcon } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/context/auth'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/courses/details/$meta')({
  component: CourseDetailsView,
})

function CourseDetailsView() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const { meta } = useParams({ from: '/courses/details/$meta' })

  const [currentLesson, setCurrentLesson] = useState<LessonType | undefined>()
  const [courseSubed, setCourseSubed] = useState(false)
  const [courseLiked, setCourseLiked] = useState(false)

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['courses', 'course-details', meta],
    queryFn: async () => {
      const res = await api.get<CourseType>(
        `${import.meta.env.VITE_BACKEND_URL}/courses/api/course/${meta}/`,
      )
      return res.data
    },
  })

  const handleSubscribe = async () => {
    if (!course) return
    const res = await api.post(`/courses/api/sub/`, { guid: course.guid })
    if (res.status === 200) {
      if (res.data.subed) {
        // if (!courseSubed) addToSubed(course)
      } else {
        // removeFromSubed(course)
      }
      setCourseSubed(res.data.subed)
    }
  }

  const handleLike = async () => {
    if (!course) return
    const res = await api.post(`/courses/api/like/`, { guid: course.guid })
    if (res.status === 200) {
      if (res.data.liked) {
        // if (!courseLiked) addToLiked(course)
      } else {
        // removeFromLiked(course)
      }
      setCourseLiked(res.data.liked)
    }
  }

  useEffect(() => {
    setCurrentLesson(course?.lessons[0])
  }, [course])

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-146px)] flex items-center">
        <LoadingComponent />
      </div>
    )
  }

  if (isError || !course) {
    return <p>Error occurred</p>
  }

  return (
    <div className="w-full h-auto bg-background py-6">
      <div className="container mx-auto max-w-[1366px]">
        <div className="flex items-start justify-start space-x-4">
          <div className="min-w-3/4 rounded-lg overflow-hidden">
            <div className="w-full aspect-[16/9]">
              {currentLesson ? (
                <iframe
                  src={currentLesson.video || ''}
                  className="w-full h-full border-0"
                />
              ) : (
                <LoadingComponent />
              )}
            </div>

            {/* Course meta */}
            <div className="w-full flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <p className="text-description flex items-center space-x-1">
                  <CalendarIcon />
                  <span>{normalizeDate(course.created_at)}</span>
                </p>
                <Link
                  to="/courses/category/$meta"
                  params={{ meta: course.category.meta }}
                  className="text-description flex items-center space-x-1"
                >
                  <FolderIcon />
                  <span>{course.category.title}</span>
                </Link>
                <p className="text-description flex items-center space-x-1">
                  <EyeIcon />
                  <span>{course.views}</span>
                </p>
              </div>
              <div className="flex items-center space-x-1.5">
                <img
                  src={course.author.pfp}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-description">
                  {course.author.first_name} {course.author.last_name}
                </span>
              </div>
            </div>
          </div>

          {/* Lessons list */}
          <div className="w-1/4">
            <div className="w-full h-auto p-4 bg-white rounded-lg">
              <h3 className="text-xl font-bold">{t('Lessons')}</h3>
              <div className="flex flex-col items-start gap-3 mt-3">
                {course.lessons.length > 0 ? (
                  course.lessons.map((lesson, index) => (
                    <button
                      key={lesson.guid}
                      className="flex items-center w-full text-brand"
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      #{t('lesson[lower]')} {index + 1}
                    </button>
                  ))
                ) : (
                  <LoadingComponent />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details + Subscribe */}
      <div className="container mx-auto max-w-[1366px] mt-4">
        <h3 className="text-2xl font-semibold text-text">{course.title}</h3>

        <div className="flex items-start gap-4">
          <div className="mt-4 bg-white p-4 rounded-lg w-3/4">
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: course.description.replaceAll('\n', '<br/>'),
              }}
            />
          </div>

          <div className="mt-4 bg-white p-4 rounded-lg w-1/4">
            <h3 className="text-2xl font-bold">{t('Subscribe')}</h3>
            <div className="details mt-3">
              <p className="flex justify-between">
                <span className="text-description">Darslar soni</span>
                <span className="text-text font-semibold">
                  {course.lessons.length}
                </span>
              </p>
              <p className="flex justify-between mt-2">
                <span className="text-description">Ustoz</span>
                <span className="text-text font-semibold">
                  {course.author.first_name} {course.author.last_name}
                </span>
              </p>
              <p className="flex justify-between mt-2">
                <span className="text-description">Narxi</span>
                <span className="text-brand font-semibold">Bepul</span>
              </p>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  className="w-full py-2 bg-brand hover:bg-white border border-brand rounded-lg mt-4 text-white hover:text-brand font-semibold transition-all"
                  onClick={handleSubscribe}
                >
                  {courseSubed ? t('Subscribed') : t('Subscribe')}
                </button>
                <button
                  className={`min-w-fit flex items-center px-2 py-2 border rounded-lg mt-4 font-semibold transition-all ${
                    courseLiked
                      ? 'text-white bg-red-300 border-red-300'
                      : 'text-description border-border'
                  }`}
                  onClick={handleLike}
                >
                  <HeartIcon />
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="w-full py-2 bg-brand hover:bg-white border border-brand rounded-lg mt-4 text-white hover:text-brand font-semibold transition-all"
              >
                {t('Login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
