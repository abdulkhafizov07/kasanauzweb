import React, { useContext } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import "./index.scss";
import { useEffect } from "react";


const News = () => {
  const newsList = [];

  useEffect(() => {
    window.scrollTo({'top': 0});    
  }, [])

  return (
    <div className="nn">
      <div id="news">
        <div className="title">
          <h2>Yangiliklar</h2>
          <Link to="/news/">Ko'proq ko'rish</Link>
        </div>
        <div className="news-cards">
          {newsList.slice(0, 4).map((news, index) => (
            <Link to={`/news/${news.category.id}/${news.id}/`} key={index}>
              <NewsCard key={news.id} news={news} index={index} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};


const NewsCard = ({ news }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`news-card ${inView ? "visible" : ""}`}
    >
      <div className="img-cont">

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
          {news.created_at.split('T')[0]}
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
          {news.views || 0}
        </span>
      </div>
      <div className="news-title">{news.title}</div>
      <div className="news-description">{news.content}</div>
      <div className="type">{news.category.title}</div>
    </div>
  );
};

export default News;
