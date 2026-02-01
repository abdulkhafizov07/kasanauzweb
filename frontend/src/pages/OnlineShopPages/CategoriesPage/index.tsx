import React, { useState } from "react";
import { Link } from "react-router-dom";

import aaa from "./Без имени-2 1.png";

import { useOnlineShopContext } from "../../../context/onlineshop";
import ProductWidget from "@/components/web/onlineshop/product";

const CategoriesPage: React.FC = () => {
  const { categories } = useOnlineShopContext();
  const [moreProducts] = useState<any[]>([]); // Replace `any` with your actual product type if available

  return (
    <>
      {/* Poster */}
      <div className="bg-white h-[100px]">
        <div className="container mx-auto max-w-[1366px] h-full flex items-center justify-between text-primary">
          <h2 className="font-semibold text-[28px]">Barcha mahsulotlar</h2>
          <img src={aaa} alt="" className="w-[790px] h-[105px]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#f5f5f5]">
        <div className="container mx-auto max-w-[1366px] flex gap-4 py-4">
          {/* Left Side */}
          <div className="min-w-[25%] space-y-4">
            <div className="bg-white rounded-[10px] p-[20px]">
              <p className="text-[18px] font-medium mb-[15px]">Kategoriyalar</p>
              <ul>
                {categories.map((category: any) => (
                  <li
                    key={category.guid}
                    className="py-[10px] border-b border-[#ebebeb] last:border-b-0"
                  >
                    <Link
                      to={`/online-shop/categories/${category.meta}`}
                      className="hover:underline"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {moreProducts.length > 0 ? (
              moreProducts.map((product: any) => (
                <ProductWidget product={product} />
              ))
            ) : (
              <p>Hech qanday mahsulot topilmadi</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
