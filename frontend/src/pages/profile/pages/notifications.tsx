import { useNotifications } from "@/context/notifications";
import React, { useEffect } from "react";

const ProfileNotificationsPage: React.FC = () => {
  const { notifications } = useNotifications();

  useEffect(() => {
    document.title = "Xabarnomalar - Kasana.UZ";
  }, []);

  return (
    <>
      <div className="content flex flex-col gap-y-2.5">
        {notifications.map((value, index) => (
          <div key={index} className="card border border-white p-2 bg-white rounded-lg">
            <h3 className="title text-xl font-bold text-black mb-1">{value.title}</h3>
            <p className="descriptoin text-md font-normal text-description">
              {value.comment}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileNotificationsPage;
