import { useCoursesContext } from "@/context/courses";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const CoursesLayout: React.FC = () => {
  const { fetchData } = useCoursesContext();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};
