import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "./pages/index";
import { CategoryDetailsPage } from "./pages/categoryDetails";
import { CourseDetails } from "./pages/courseDetails";
import { CoursesLayout } from "./layout";

const CoursesRoutes: React.ReactElement = (
  <Route path="courses" element={<CoursesLayout />}>
    <Route index element={<HomePage />} />
    <Route path="categories/details/:meta" element={<CategoryDetailsPage />} />
    <Route path="details/:meta" element={<CourseDetails />} />
  </Route>
);

export default CoursesRoutes;
