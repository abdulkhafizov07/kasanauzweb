import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './index.scss'
import { newsApi, usersApi } from '@/server'
import LoadingComponent from '@/components/web/loader'
import { normalizeDate } from '@/utils'
import { NewsItem } from '@/types/news'
import { RightSide } from '@/components/web/news/rightside'
import SuccessfulExperience from '@/components/web/courses/successfulExperience'

export const DetailsPage: React.FC = () => {
  const { meta } = useParams()
  const [newsItem, setNewsItem] = useState<NewsItem | undefined>(undefined)
  const [fc] = useState({ title: 'Loading...' })

  useEffect(() => {
    axios
      .get(`${newsApi}details/${meta}/`)
      .then((res) => {
        setNewsItem(res.data)
      })
      .catch((err) => {})
  }, [meta])

  return (
    <div className="w-full h-full bg-background">
      {newsItem ? (
        <div className="container mx-auto max-w-[1366px] py-3">
          <div className="flex space-x-3 items-start justify-start">
            <div className="bg-white p-3 rounded-lg w-2/3">
              <div className="aspect-[16/9]">
                <img
                  src={`${newsApi?.replace('/api/', '')}${newsItem.thumbnail}`}
                  alt=""
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>

              <div className="w-full flex items-center justify-center h-full mt-4 space-x-4">
                <p className="text-description flex items-center justify-center space-x-1">
                  <span className="icon">
                    <CalendarIcon />
                  </span>
                  <span className="text">
                    {normalizeDate(newsItem.created_at)}
                  </span>
                </p>
                <Link
                  to={'/news/categories/details/' + newsItem.category.meta}
                  className="min-w-fit text-description flex items-center justify-center space-x-1"
                >
                  <span className="icon">
                    <DirectoryIcon />
                  </span>
                  <span className="text">{newsItem.category.title}</span>
                </Link>
                <p className="text-text flex items-center justify-center space-x-1">
                  <span className="icon">
                    <ViewsIcon />
                  </span>
                  <span className="text">{newsItem.views}</span>
                </p>
                <span className="w-full"></span>
                <div className="flex items-center justify-center min-w-fit space-x-2">
                  <img
                    src={`${usersApi?.replace('/api/', '')}${
                      newsItem.user.pfp
                    }`}
                    alt=""
                    className="w-6 h-6"
                  />
                  <span className="text-description">
                    {newsItem.user.first_name} {newsItem.user.last_name}
                  </span>
                </div>
              </div>

              <div className="w-full mt-3">
                <h1 className="text-3xl font-bold">{newsItem.title}</h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: newsItem.description.replaceAll('\n', '</br>'),
                  }}
                  className="lg:max-w-[1024px] text-description"
                ></p>
              </div>
            </div>
            <div className="sticky top-26 w-1/3">
              <RightSide />
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}

      {/* <div className="simillar">
        <h2>O'xshash yangiliklar</h2>
        <div className="news-cards">
          {/* {similliarNews.length > 0 ? (
            similliarNews.map((news, index) => (
              <Link
                to={`/news/${similliarNews[0]?.category
                  .replace(/\s+/g, "-")
                  .toLowerCase()}/${news.id}`}
              >
                <div className="news-card">
                  <div className="img-cont">
                    <img src={news.img} alt={news.title} />
                  </div>
                  <div className="time">
                    <span id="date-time">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_355_9883)">
                          <path
                            d="M10.0003 5.00008V10.0001L13.3337 11.6667M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001Z"
                            stroke="#41A58D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_355_9883">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      {news.date}
                    </span>
                    <span id="views-count">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.833008 9.99992C0.833008 9.99992 4.16634 3.33325 9.99967 3.33325C15.833 3.33325 19.1663 9.99992 19.1663 9.99992C19.1663 9.99992 15.833 16.6666 9.99967 16.6666C4.16634 16.6666 0.833008 9.99992 0.833008 9.99992Z"
                          stroke="#41A58D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.99967 12.4999C11.3804 12.4999 12.4997 11.3806 12.4997 9.99992C12.4997 8.61921 11.3804 7.49992 9.99967 7.49992C8.61896 7.49992 7.49967 8.61921 7.49967 9.99992C7.49967 11.3806 8.61896 12.4999 9.99967 12.4999Z"
                          stroke="#41A58D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {news.views}
                    </span>
                  </div>
                  <div className="news-title">{news.title}</div>
                  <div className="news-description">{news.description}</div>
                  <div className="type">{news.type}</div>
                </div>
              </Link>
            ))
          ) : (
            <p>O'xshash yangiliklar mavjud emas</p>
          )}
        </div>
      </div> */}

      <SuccessfulExperience />

      {/* <h2 className="currency-title">Foydali ma'lumotlar</h2>
      <p className="currency-little-title">Iqlim va valyuta ma'lumotlari</p>
      <div className="g-container">
        
      </div> */}
    </div>
  )
}
