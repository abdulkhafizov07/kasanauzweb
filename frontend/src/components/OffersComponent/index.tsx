import React, { useState, useEffect } from "react";

import Loading from "@/components/web/loader";

import { useOnlineShopContext } from "@/context/onlineshop";
import ProductWidget from "@/components/web/onlineshop/product";

const Offers: React.FC = () => {
  const { recommendedProducts } = useOnlineShopContext();
  const [moreRecommendedProducts, setMoreRecommendedProducts] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMoreRecommendedProducts(recommendedProducts);
    setLoading(false);
  }, [recommendedProducts]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setMoreRecommendedProducts((prev) => [...prev, ...recommendedProducts]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto max-w-[1366px] px-4">
      <div className="mt-6">
        <h3 className="text-3xl font-semibold text-text">Takliflar</h3>
        <div className="text-description mt-1 text-base">
          Yangi mahsulotlarni sinab ko'ring!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {moreRecommendedProducts.map((product, index) => (
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

export default Offers;
