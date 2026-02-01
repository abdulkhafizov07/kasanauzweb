import React, { useEffect } from 'react'

import HeroSection from '@/components/web/home/hero'
import AboutSection from '@/components/web/home/about'
import OpportunitiesSection from '@/components/web/home/opportunities'
import DocumentsSection from '@/components/web/news/documents'
import { useTranslation } from 'react-i18next'
import { useCoursesContext } from '@/context/courses'
import CourseWidget from '@/components/web/courses/course'
import Success from '@/components/SuccessComponent'

import FlagImage from '@/assets/home/flag.png'
import PresidentImage from '@/assets/home/president.png'
import { useNewsContext } from '@/context/news'
import NewsWidget from '@/components/web/news/news'
import { WorkAnnouncementCardWidget } from '@/components/web/announcements/work-card'
import { AnnouncementType } from '@/types/announcements'
import { Link } from '@tanstack/react-router'

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { newCourses } = useCoursesContext()
  const { weekNews } = useNewsContext()
  const workAnnouncement: AnnouncementType[] = []

  useEffect(() => {
    document.title = 'Bosh sahifa - Kasana.UZ'
  }, [])

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <OpportunitiesSection />
      <DocumentsSection />

      <section id="courses">
        <div className="container mx-auto max-w-[1366px] py-6">
          <div className="section-title mb-3 flex items-center justify-between">
            <h3 className="text-2xl font-medium">{t('Courses')}</h3>

            <Link
              to="/courses"
              className="flex items-center justify-center py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
              Ko'proq ko'rish
            </Link>
          </div>

          <div className="grid grid-cols-4 space-x-3">
            {newCourses.map((value, index) => (
              <CourseWidget course={value} key={index} noAnimation={false} />
            ))}
          </div>
        </div>
      </section>

      <div className="relative bg-brand">
        <img src={FlagImage} alt="" className="select-none w-1/2 z-0" />
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-cover bg-gradient-to-r from-brand/0 via-brand to-brand">
          <div className="container mx-auto max-w-[1366px] h-full flex items-center justify-center lg:px-22">
            <img src={PresidentImage} alt="" className="h-full select-none" />

            <div className="content text-white">
              <h3 className="text-3xl font-medium">
                Hunarmandchilikning paydo bo‘lishi –<br /> rivojlanish sari
                tashlangan eng muhim tarixiy qadam
              </h3>
              <p>Shavkat Mirziyoyev</p>
            </div>
          </div>
        </div>
      </div>

      <section id="news" className="bg-bg-placeholder">
        <div className="container mx-auto max-w-[1366px] py-6">
          <div className="section-title mb-3 flex items-center justify-between">
            <h3 className="text-2xl font-medium">{t('News')}</h3>

            <Link
              to="/news"
              className="flex items-center justify-center py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
              Ko'proq ko'rish
            </Link>
          </div>

          <div className="grid grid-cols-4 space-x-3">
            {weekNews.slice(0, 4).map((value, index) => (
              <NewsWidget news={value} key={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="announcements">
        <div className="container mx-auto max-w-[1366px] py-6">
          <div className="section-title mb-3 flex items-center justify-between">
            <h3 className="text-2xl font-medium">{t('announcements')}</h3>

            <Link
              to="/announcements"
              className="flex items-center justify-center py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
              Ko'proq ko'rish
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {workAnnouncement.slice(0, 4).map((value, index) => (
              <WorkAnnouncementCardWidget value={value} key={index} />
            ))}
          </div>
        </div>
      </section>

      <Success />
    </div>
  )
}

export default HomePage
