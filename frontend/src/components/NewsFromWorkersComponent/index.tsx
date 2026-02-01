import React, { useEffect, useState } from "react";

import Loading from "@/components/web/loader";

import { useOnlineShopContext } from "../../context/onlineshop";
import ProductWidget from "@/components/web/onlineshop/product";

const News: React.FC = () => {
  const { newProducts } = useOnlineShopContext();
  const [moreNewProducts, setMoreNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMoreNewProducts(newProducts);
    setLoading(false);
  }, [newProducts]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setMoreNewProducts([...moreNewProducts, ...newProducts]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div id="topNews" className="px-4 md:px-0">
      <div className="container mx-auto max-w-[1366px] mt-6 px-4">
        <div className="text-text text-3xl font-semibold">
          Kasanachilarimizdan yangilik🚀
        </div>
        <div className="text-description mt-1 text-[16px]">
          Yangi mahsulotlarni sinab koring!
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
          {moreNewProducts.map((product, index) => (
            <ProductWidget product={product} key={index} />
          ))}
        </div>

        {loading && (
          <div className="py-9">
            <Loading />
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 text-brand border border-gray-200 hover:bg-gray-100 rounded-lg text-base transition cursor-pointer"
          >
            Ko'proq ko'rish
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
