import React, { createContext, useState, ReactNode, useEffect } from "react";

// Notification type
export interface NotificationItem {
  id: number;
  title: string;
  comment: string;
  type: string;
  closed: boolean;
}

// Context type
interface NotificationsContextType {
  notifications: NotificationItem[];
  addNotification: (title: string, comment: string, type: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

// Context init
const Notifications = createContext<NotificationsContextType | undefined>(
  undefined
);

interface NotificationsProviderProps {
  children: ReactNode;
}

const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [saveSafe, setSaveSafe] = useState<boolean>(false);

  useEffect(() => {
    setSaveSafe(false);
    const storedNotifications = JSON.parse(
      window.localStorage.getItem("notifications") || "[]"
    );
    setNotifications(storedNotifications);
    setSaveSafe(true);
  }, []);

  useEffect(() => {
    if (saveSafe) {
      window.localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (
    title: string,
    comment: string,
    type: string
  ): void => {
    setNotifications((prevNotifications) => {
      const newNotifications = [
        ...prevNotifications,
        {
          id: (prevNotifications[prevNotifications.length - 1]?.id || 0) + 1,
          title,
          comment,
          type,
          closed: false,
        },
      ];

      if (saveSafe) {
        window.localStorage.setItem("notifications", JSON.stringify(newNotifications));
      }

      return newNotifications;
    });
  };

  return (
    <Notifications.Provider
      value={{ notifications, addNotification, setNotifications }}
    >
      {children}
    </Notifications.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = React.useContext(Notifications);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export default NotificationsProvider;
export { Notifications };
