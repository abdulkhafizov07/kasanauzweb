import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { newsApi } from "@/server";
import {
  DocumentType,
  NewsCategory,
  NewsContextType,
  NewsItem,
  NewsProviderProps,
} from "@/types/news";

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [bannerNews, setBannerNews] = useState<NewsItem[]>([]);
  const [weekNews, setWeekNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [legacyDocuments, setLegacyDocuments] = useState<DocumentType[]>([]);
  const [bussiniesDocuments, setBussiniesDocuments] = useState<DocumentType[]>(
    []
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${newsApi}home-data/`);
      if (response.status === 200) {
        setCategories(response.data.categories);
        setBannerNews(response.data.banner);
        setWeekNews(response.data.week);
        setLegacyDocuments(response.data.documents.legacy_documents);
        setBussiniesDocuments(response.data.documents.bussinies_documents);
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewsContext.Provider
      value={{
        categories,
        bannerNews,
        weekNews,
        loading,
        legacyDocuments,
        bussiniesDocuments,
        fetchData,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};
