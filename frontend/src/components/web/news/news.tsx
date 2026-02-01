import { NewsItem } from '@/types/news'
import { normalizeDate } from '@/utils'
import React from 'react'
import { Link } from '@tanstack/react-router'
import { CalendarDaysIcon, EyeIcon } from 'lucide-react'

const NewsWidget: React.FC<{ news: NewsItem }> = ({ news }) => {
  return (
    <>
      <Link to="/news">
        <div className="rounded-lg overflow-hidden hover:shadow-lg shadow-gray-300/40 transition-all duration-200 ease-in-out bg-white">
          <div className="aspect-[13/9]">
            <img
              src={news.thumbnail}
              alt={news.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-brand flex items-center space-x-1">
                <span className="icon">
                  <CalendarDaysIcon />
                </span>
                <span className="text">{normalizeDate(news.created_at)}</span>
              </p>
              <p className="text-brand flex items-center space-x-1">
                <span className="icon">
                  <EyeIcon />
                </span>
                <span className="text">{news.views}</span>
              </p>
            </div>

            <div className="text-text font-semibold text-[17px] mt-2">
              {news.title}
            </div>
            <div className="text-description mt-1 mb-3">
              {news.short_description?.split('.')[0]}
            </div>

            <span className="py-1 px-1 text-text bg-bg-placeholder rounded-lg">
              {news.category.title}
            </span>
          </div>
        </div>
      </Link>
    </>
  )
}

export default NewsWidget
