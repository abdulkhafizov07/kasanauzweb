import React from "react";
import { Navigate, Route } from "react-router-dom";
import { AdminLayout } from "./layout";
import { StatisticsPage } from "./pages/statistics";
import { AdminUsersRoutes } from "./pages/users/routes";
import { AdminOnlineshopRoutes } from "./pages/onlineshop/routes";
import { AdminAnnouncementsRoutes } from "./pages/announcements/routes";
import { AdminLogsRoutes } from "./pages/logs/routes";
import { AdminCoursesRoutes } from "./pages/courses/routes";
import { AdminNewsRoutes } from "./pages/news/routes";
import { NotFoundPage } from "./pages/404page";

export const AdminRoutes: React.ReactElement = (
  <Route path="admin" element={<AdminLayout />}>
    <Route path="" element={<Navigate to={"overview"} />} />
    <Route path="overview" element={<StatisticsPage />} />
    {AdminUsersRoutes}
    {AdminOnlineshopRoutes}
    {AdminCoursesRoutes}
    {AdminNewsRoutes}
    {AdminAnnouncementsRoutes}
    {AdminLogsRoutes}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);
