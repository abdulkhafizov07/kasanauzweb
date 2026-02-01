import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useOnlineShopContext } from "../../../context/onlineshop";
import axios from "axios";
import { onlineShopApi } from "../../../server";
import ProductWidget from "@/components/web/onlineshop/product";
import { ProductType, ProductCategory } from "@/types/onlineshop";

interface Category {
  meta: string;
  title: string;
}

const CategoryPage: React.FC = () => {
  const { categories } = useOnlineShopContext();
  const { category } = useParams<{ category: string }>();
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [moreProducts, setMoreProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await axios.get(`${onlineShopApi}category/${category}`);
    if (response.status === 200) {
      setMoreProducts(response.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (categories.length) {
      setCategoryData(
        categories.find((value: Category) => value.meta === category) || null
      );
      fetchData();
      setLoading(false);
    }
  }, [category, categories]);

  return (
    <>
      <h2 className="text-xl font-semibold container mx-auto max-w-[1366px] mb-4 mt-3">
        {loading ? "Loading..." : `${categoryData?.title} bo'yicha mahsulotlar`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 container mx-auto max-w-[1366px] px-4 pb-4 sm:px-0">
        {moreProducts.length > 0
          ? moreProducts.map((product, index) => (
              <ProductWidget product={product} key={index} />
            ))
          : !loading && (
              <p className="col-span-full text-center text-gray-600">
                Bu kategoriyada mahsulotlar topilmadi.
              </p>
            )}
      </div>
    </>
  );
};

export default CategoryPage;
