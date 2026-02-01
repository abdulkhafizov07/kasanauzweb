import React from "react";
import { Navigate, Route } from "react-router-dom";
import { AdminAnnouncementsAnnouncementRoutes } from "./pages/announcements/routes";

export const AdminAnnouncementsRoutes: React.ReactElement = (
  <Route path="announcements">
    <Route path="" element={<Navigate to={"all"} />} />
    {AdminAnnouncementsAnnouncementRoutes}
  </Route>
);
