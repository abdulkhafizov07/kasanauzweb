import React from "react";
import { Navigate, Route } from "react-router-dom";
import { AdminOnlineshopProductsRoutes } from "./pages/products/routes";
import { AdminOnlineshopCategoriesRoutes } from "./pages/categories/routes";

export const AdminOnlineshopRoutes: React.ReactElement = (
  <Route path="onlineshop">
    <Route path="" element={<Navigate to={"products"} />} />
    {AdminOnlineshopProductsRoutes}
    {AdminOnlineshopCategoriesRoutes}
  </Route>
);
