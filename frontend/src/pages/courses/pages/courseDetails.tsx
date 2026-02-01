import NotFoundPage from '@/pages/NotFoundPage/index'
import LoadingComponent from '@/components/web/loader'
import { useCoursesContext } from '@/context/courses'
import { useUserContext } from '@/context/user'
import { CourseType, LessonType } from '@/types/courses'
import { normalizeDate } from '@/utils'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from '@tanstack/react-router'
import { CalendarDaysIcon, EyeIcon, FolderIcon } from 'lucide-react'

export const CourseDetails: React.FC = () => {
  const { meta } = useParams({ from: '/courses/details/$meta' })
  const { t } = useTranslation()
  const coursesContext = useCoursesContext()
  const {
    userLikedCourses,
    userSubedCourses,
    addToLiked,
    removeFromLiked,
    addToSubed,
    removeFromSubed,
  } = coursesContext
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [course, setCourse] = useState<CourseType | undefined>(undefined)
  const [courseSubed, setCourseSubed] = useState<boolean>(false)
  const [courseLiked, setCourseLiked] = useState<boolean>(false)
  const [currentLesson, setCurrentLesson] = useState<LessonType | undefined>(
    undefined,
  )
  const [currentLessonGuid, setCurrentLessonGuid] = useState<
    string | undefined
  >(undefined)
  const { isAuthenticated } = useUserContext()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/courses/api/course/${meta}/`)
      .then((res) => {
        setCourse(res.data)
        if (res.data.lessons[0]) {
          setCurrentLessonGuid(res.data.lessons[0].guid)
        }
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [meta])

  useEffect(() => {
    setCourseSubed(
      Boolean(userSubedCourses.find((v) => v.guid === course?.guid)),
    )
  }, [userSubedCourses, course])

  useEffect(() => {
    setCourseLiked(
      Boolean(userLikedCourses.find((v) => v.guid === course?.guid)),
    )
  }, [userLikedCourses, course])

  useEffect(() => {
    if (currentLessonGuid) {
      setCurrentLesson(undefined)
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/courses/api/lesson/${currentLessonGuid}/`,
        )
        .then((res) => {
          setCurrentLesson(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [currentLessonGuid])

  const handleSubscribe = () => {
    if (course?.guid) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/courses/api/sub/`, {
          guid: course.guid,
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.subed) {
              if (!courseSubed) {
                addToSubed(course)
              }
            } else {
              removeFromSubed(course)
            }
          }
        })
        .catch(() => {})
    }
  }

  const handleLike = () => {
    if (course?.guid) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/courses/api/like/`, {
          guid: course.guid,
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.liked) {
              if (!courseLiked) {
                addToLiked(course)
              }
            } else {
              removeFromLiked(course)
            }
          }
        })
        .catch(() => {})
    }
  }

  if (error) {
    return <NotFoundPage />
  }

  return (
    <>
      {loading || coursesContext.loading ? (
        <div className="w-full min-h-[calc(100vh-146px)] flex items-center">
          <LoadingComponent />
        </div>
      ) : (
        <div className="w-full h-auto bg-background py-6">
          <div className="container mx-auto max-w-[1366px]">
            <div className="flex items-start justify-start space-x-4">
              <div className="min-w-3/4 rounded-lg overflow-hidden">
                <div className="w-full aspect-[16/9]">
                  {currentLesson && currentLesson.guid ? (
                    <>
                      <iframe
                        src={currentLesson.video || ''}
                        className="w-full h-full border-0"
                      ></iframe>
                    </>
                  ) : (
                    <LoadingComponent />
                  )}
                </div>

                <div className="w-full flex items-center justify-between mt-3">
                  <div className="flex items-center justify-center space-x-4">
                    <p className="text-description flex items-center justify-center space-x-1">
                      <span className="icon">
                        <CalendarDaysIcon />
                      </span>
                      <span className="text">
                        {course && normalizeDate(course.created_at)}
                      </span>
                    </p>
                    <Link
                      to="/courses/details/$meta"
                      params={{ meta: course?.category.meta || '' }}
                      className="text-description flex items-center justify-center space-x-1"
                    >
                      <span className="icon">
                        <FolderIcon />
                      </span>
                      <span className="text">{course?.category.title}</span>
                    </Link>
                    <p className="text-description flex items-center justify-center space-x-1">
                      <span className="icon">
                        <EyeIcon />
                      </span>
                      <span className="text">{course?.views}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/media/${
                        course?.author.pfp
                      }`}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-description">
                      {course?.author.first_name} {course?.author.last_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-1/4">
                <div className="w-full h-auto p-4 bg-white rounded-lg">
                  <h3 className="text-xl font-bold">{t('Lessons')}</h3>

                  <div className="flex flex-col items-start gap-3 mt-3">
                    {course?.lessons ? (
                      course.lessons.map((value, index) => (
                        <button
                          className="flex items-center justify-start w-full text-brand cursor-pointer"
                          key={index}
                          onClick={() => {
                            setCurrentLessonGuid(value.guid)
                          }}
                        >
                          #{t('lesson[lower]')}
                          {value.order}
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

          {course ? (
            <>
              <div className="container mx-auto max-w-[1366px] mt-4">
                <h3 className="text-2xl font-semibold text-text">
                  {course?.title}
                </h3>

                <div className="flex items-start justify-start gap-4">
                  <div className="mt-4 bg-white p-4 rounded-lg w-3/4">
                    <div className="content">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: course.description.replaceAll('\n', '<br/>'),
                        }}
                      ></p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white p-4 rounded-lg w-1/4">
                    <h3 className="text-2xl font-bold">{t('Subscribe')}</h3>

                    <div className="details mt-3">
                      <p className="flex items-center justify-between">
                        <span className="label text-description">
                          Darslar soni
                        </span>
                        <span className="value text-text font-semibold">
                          {course.lessons.length}
                        </span>
                      </p>
                      <p className="flex items-center justify-between mt-2">
                        <span className="label text-description">Ustoz</span>
                        <span className="value text-text font-semibold">
                          {course.author.first_name} {course.author.last_name}
                        </span>
                      </p>
                      <p className="flex items-center justify-between mt-2">
                        <span className="label text-description">Narxi</span>
                        <span className="value text-brand font-semibold">
                          Bepul
                        </span>
                      </p>
                    </div>

                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            className="w-full flex items-center justify-center py-2 bg-brand hover:bg-white border border-brand rounded-lg mt-4 text-white hover:text-brand font-semibold transition-all duration-200 ease-in cursor-pointer"
                            onClick={handleSubscribe}
                          >
                            {courseSubed ? t('Subscribed') : t('Subscribe')}
                          </button>

                          <button
                            className={
                              'min-w-fit flex items-center justify-center px-2 py-2 border rounded-lg mt-4 font-semibold transition-all duration-200 ease-in cursor-pointer ' +
                              String(
                                courseLiked
                                  ? 'text-white bg-red-300 border-red-300'
                                  : 'text-description border-border',
                              )
                            }
                            onClick={handleLike}
                          >
                            <span className="icon">
                              <ProductLikeIcon />
                            </span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={'/auth/sign-in/'}
                        className="w-full flex items-center justify-center py-2 bg-brand hover:bg-white border border-brand rounded-lg mt-4 text-white hover:text-brand font-semibold transition-all duration-200 ease-in cursor-pointer"
                      >
                        {t('Login')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12">
              <LoadingComponent />
            </div>
          )}
        </div>
      )}
    </>
  )
}
