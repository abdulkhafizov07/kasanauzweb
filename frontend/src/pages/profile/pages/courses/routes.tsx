import React from "react";
import { Route } from "react-router-dom";
import UserCourses from "./user/list";
import LikedCourses from "./liked/list";

const ProfileCoursesRoutes: React.ReactElement = (
  <Route path="courses">
    <Route path="user" element={<UserCourses />} />
      <Route path="liked" element={<LikedCourses />}/>
  </Route>
);

export default ProfileCoursesRoutes;
