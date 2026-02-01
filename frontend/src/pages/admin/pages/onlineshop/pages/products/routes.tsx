import React from "react";
import { Route } from "react-router-dom";
import { ListPage } from "./pages/list/index";
import { CreatePage } from "./pages/create";
import { DeletePage } from "./pages/delete";
import { EditPage } from "./pages/edit";

export const AdminOnlineshopProductsRoutes: React.ReactElement = (
  <Route path="products">
    <Route path="" element={<ListPage />} />
    <Route path="create" element={<CreatePage />} />
    <Route path="delete/:guid" element={<DeletePage />} />
    <Route path="edit/:guid" element={<EditPage />} />
  </Route>
);
