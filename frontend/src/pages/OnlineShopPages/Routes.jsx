import { Route } from "react-router-dom";
import HomePage from "./HomePage";
import DetailPage from "./DetailPage";
import CategoriesPage from "./CategoriesPage";
import CategoryPage from "./CategoryPage";
import NotFoundPage from "../NotFoundPage";
import { OnlineShopLayout } from "./layout";

const OnlineShopRoutes = (
  <Route path="online-shop" element={<OnlineShopLayout />}>
    <Route index element={<HomePage />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="categories/:category" element={<CategoryPage />} />
    <Route path="details/:meta" element={<DetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default OnlineShopRoutes;
