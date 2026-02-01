import React from "react";
import { Route } from "react-router-dom";
import UserProducts from "./user/list";
import UserCreateProduct from "./user/create";
import LikedProducts from "./liked/list";

const ProfileProductsRoutes: React.ReactElement = (
  <Route path="products">
    <Route path="user">
        <Route index element={<UserProducts />} />
        <Route path="create" element={<UserCreateProduct />} />
    </Route>

      <Route path="liked" element={<LikedProducts />} />
  </Route>
);

export default ProfileProductsRoutes;
