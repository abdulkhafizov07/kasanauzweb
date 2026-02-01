import React from "react";
import { Navigate, Route } from "react-router-dom";
import { AdminCoursesCoursesRoutes } from "./pages/courses/routes";
import { AdminCoursesCategoriesRoutes } from "./pages/categories/routes";
// import { AdminCoursesTeachersRoutes } from "./pages/teachers/routes";
// import { AdminCoursesStudentsRoutes } from "./pages/students/routes";

export const AdminCoursesRoutes: React.ReactElement = (
  <Route path="courses">
    <Route path="" element={<Navigate to={"courses"} />} />
    {AdminCoursesCoursesRoutes}
    {AdminCoursesCategoriesRoutes}
    {/* {AdminCoursesTeachersRoutes} */}
    {/* {AdminCoursesStudentsRoutes} */}
  </Route>
);
