import React from "react";
import { Route } from "react-router-dom";
import ProfileLayout from "./layout";
import ProfileDetailPage from "@/pages/profile/pages/home";
import ProfileProductsRoutes from "@/pages/profile/pages/products/routes";
import ProfileMessagesPage from "@/pages/profile/pages/messages";
import ProfileEditPage from "@/pages/profile/pages/edit";
import ProfileNotificationsPage from "@/pages/profile/pages/notifications";
import ProfileAnnouncementsRoutes from "@/pages/profile/pages/announcements/routes";
import ProfileCoursesRoutes from "@/pages/profile/pages/courses/routes";

const ProfileRoutes: React.ReactElement = (
  <Route path="profile" element={<ProfileLayout />}>
    <Route path="overview" element={<ProfileDetailPage />} />
    <Route path="overview/edit" element={<ProfileEditPage />} />
    <Route path="messages" element={<ProfileMessagesPage />} />
    <Route path="notifications" element={<ProfileNotificationsPage />} />
    {ProfileProductsRoutes}
    {ProfileAnnouncementsRoutes}
    {ProfileCoursesRoutes}
  </Route>
);

export default ProfileRoutes;
