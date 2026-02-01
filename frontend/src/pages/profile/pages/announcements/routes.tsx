import React from "react";
import { Route } from "react-router-dom";
import UserAnnouncements from "./user/list";
import SavedAnnouncements from "./liked/list";

const ProfileAnnouncementsRoutes: React.ReactElement = (
  <Route path="announcements">
    <Route path="user" element={<UserAnnouncements />} />
      <Route path="saved" element={<SavedAnnouncements />}/>
  </Route>
);

export default ProfileAnnouncementsRoutes;
