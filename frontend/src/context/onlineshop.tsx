import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { onlineShopApi } from "../server";
import {
  LoadUserProductsProps,
  OnlineShopContextType,
  OnlineShopProviderProps,
  ProductCategory,
  ProductType,
} from "@/types/onlineshop";

const OnlineShopContext = createContext<OnlineShopContextType | undefined>(
  undefined
);

const OnlineShopProvider = ({ children }: OnlineShopProviderProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [fastSellingProducts, setFastSellingProducts] = useState<ProductType[]>(
    []
  );
  const [newProducts, setNewProducts] = useState<ProductType[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>(
    []
  );
  const [userProducts, setUserProducts] = useState<ProductType[]>([]);
  const [userLikedProducts, setUserLikedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${onlineShopApi}home-data/`);
      if (response.status === 200) {
        setCategories(response.data.categories);
        setFastSellingProducts(response.data.fast_selling_products);
        setNewProducts(response.data.new_products);
        setRecommendedProducts(response.data.recommended_products);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikedProducts = async () => {
    axios.get(`${onlineShopApi}user-liked-products/`).then((res) => {
      if (res.status === 200 && res.data) {
        setUserLikedProducts(res.data);
      }
    });
  };

  const addToLiked = (product: ProductType) => {
    setUserLikedProducts((prev) => [...prev, product]);
  };

  const removeFromLiked = (product: ProductType) => {
    setUserLikedProducts((prev) =>
      prev.filter((value) => value.guid !== product.guid)
    );
  };

  const loadUserProducts = async ({
    page = 1,
    number = 10,
  }: LoadUserProductsProps = {}): Promise<void> => {
    try {
      const response = await axios.get(
        `${onlineShopApi}user-products/?page=${page}&number=${number}`
      );

      if (response.status === 200) {
        setUserProducts(response.data);
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to load user products:", error);
    }
  };

  return (
    <OnlineShopContext.Provider
      value={{
        loading,
        categories,
        fastSellingProducts,
        newProducts,
        recommendedProducts,
        userProducts,
        loadUserProducts,
        userLikedProducts,
        addToLiked,
        removeFromLiked,
        fetchData,
        fetchUserLikedProducts,
      }}
    >
      {children}
    </OnlineShopContext.Provider>
  );
};

export const useOnlineShopContext = (): OnlineShopContextType => {
  const context = useContext(OnlineShopContext);
  if (!context) {
    throw new Error(
      "useOnlineShopContext must be used within a OnlineShopProvider"
    );
  }
  return context;
};

export { OnlineShopContext, OnlineShopProvider };
