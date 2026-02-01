import React from "react";
import { Route } from "react-router-dom";
import { ListPage } from "./pages/list";

export const AdminOnlineshopCategoriesRoutes: React.ReactElement = (
  <Route path="categories">
    <Route path="" element={<ListPage />} />
  </Route>
);
