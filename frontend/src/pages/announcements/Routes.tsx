import React from "react";
import { Route } from "react-router-dom";
import HomePage from "./pages/index";

import AnnouncementPage from "./pages/announcement";
import ServicePage from "./pages/service";
import { CreatePage } from "./pages/create";
import { AnnouncementsLayout } from "./layout";

const AnnouncementsRoutes: React.ReactNode = (
  <Route path="announcements" element={<AnnouncementsLayout />}>
    <Route index element={<HomePage />} />
    <Route path="details/:meta" element={<AnnouncementPage />} />
    <Route path="services/details/:meta" element={<ServicePage />} />
    <Route path="create" element={<CreatePage />} />
  </Route>
);

export default AnnouncementsRoutes;
