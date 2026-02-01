import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "./HomePage/index.tsx";
import { DetailsPage } from "./DetailsPage/index.tsx";
import { CategoryDetailsPage } from "./categoryDetails.tsx";
import DocumentsPage from "./DocumentsPage";
import { DocumentDetailsPage } from "./document.tsx";
import { NewsLayout } from "./layout.tsx";

const NewsRoutes = (
  <Route path="news" element={<NewsLayout />}>
    <Route index element={<HomePage />} />
    <Route path="details/:meta" element={<DetailsPage />} />
    <Route path="categories/details/:meta" element={<CategoryDetailsPage />} />
    <Route path="documents/:type" element={<DocumentsPage />} />
    <Route path="document/:guid" element={<DocumentDetailsPage />} />
  </Route>
);

export default NewsRoutes;
