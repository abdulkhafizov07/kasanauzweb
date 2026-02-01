import { useNewsContext } from "@/context/news";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const NewsLayout: React.FC = () => {
  const { fetchData } = useNewsContext();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};
