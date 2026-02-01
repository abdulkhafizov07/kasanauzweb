import { useAnnouncements } from "@/context/announcements";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const AnnouncementsLayout: React.FC = () => {
  const { fetchData } = useAnnouncements();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};
