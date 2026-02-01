import React from "react";
import { Route } from "react-router-dom";
import { ListPage } from "./pages/list";

export const AdminNewsDocumentsRoutes: React.ReactElement = (
  <Route path="documents">
    <Route path="" element={<ListPage />} />
  </Route>
);
