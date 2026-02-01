import React from "react";
import { Navigate, Route } from "react-router-dom";
import { ListPage } from "./pages/list/index";
import { CreatePage } from "./pages/create";
import { DeletePage } from "./pages/delete";
import { EditPage } from "./pages/edit";

export const AdminUsersRoutes: React.ReactElement = (
  <Route path="users">
    <Route path="" element={<Navigate to={"all"} />} />
    <Route path=":role" element={<ListPage />} />
    <Route path="create" element={<CreatePage />} />
    <Route path="delete/:guid" element={<DeletePage />} />
    <Route path="edit/:guid" element={<EditPage />} />
  </Route>
);
