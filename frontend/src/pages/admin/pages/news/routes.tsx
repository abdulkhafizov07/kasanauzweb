import React from "react";
import { Navigate, Route } from "react-router-dom";
import { AdminNewsNewsRoutes } from "./pages/news/routes";
import { AdminNewsCategoriesRoutes } from "./pages/categories/routes";
import { AdminNewsDocumentsRoutes } from "./pages/documents/routes";

export const AdminNewsRoutes: React.ReactElement = (
  <Route path="news">
    <Route path="" element={<Navigate to={"news"} />} />
    {AdminNewsNewsRoutes}
    {AdminNewsCategoriesRoutes}
    {AdminNewsDocumentsRoutes}
  </Route>
);
