import { useContext, useEffect, useState } from "react";
import "./notification.scss";
import { Notifications } from "../../context/notifications";

const Notification = ({ number, data, setData }) => {
  const [intervalSeconds, setIntervalSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalSeconds((prevInterval) => {
        if (prevInterval >= 15000) {
          setData({ ...data, closed: true });
          clearInterval(interval);
          return prevInterval;
        }
        return prevInterval + 50;
      });
    }, 1000 / 20);

    return () => {
      clearInterval(interval);
    };
  }, [data.id, setData]);

  const progress = (intervalSeconds / 15000) * 100;

  return (
    <div
      className="notification"
      style={{
        "--i": number,
        "--color": data.type === "error" ? "red" : "#41A58D",
      }}
    >
      <div className="notification-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M9.9974 13.3333V9.99996M9.9974 6.66663H10.0057M18.3307 9.99996C18.3307 14.6023 14.5998 18.3333 9.9974 18.3333C5.39502 18.3333 1.66406 14.6023 1.66406 9.99996C1.66406 5.39759 5.39502 1.66663 9.9974 1.66663C14.5998 1.66663 18.3307 5.39759 18.3307 9.99996Z"
            stroke={data.type === "error" ? "red" : "#41A58D"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="notification-content">
        <p className="title">{data.title}</p>
        <p className="comment">{data.comment}</p>
      </div>
      <div className="notification-close">
        <button
          onClick={() => {
            setData({ ...data, closed: true });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke={data.type === "error" ? "red" : "#41A58D"}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="progressbar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const NotificationsDisplay = () => {
  const { notifications, setNotifications } = useContext(Notifications);

  const handleUpdateData = (data) => {
    if (data.closed) {
      setNotifications((prevNots) =>
        prevNots.map((value) => (value.id === data.id ? data : value))
      );
    }
  };

  return (
    <div className="notifications">
      {notifications
        .filter(value => !value.closed)
        .map((value, index) => (
          <Notification
            key={value.id}
            number={index + 1}
            data={value}
            setData={handleUpdateData}
          />
        ))}
    </div>
  );
};

export default NotificationsDisplay;
