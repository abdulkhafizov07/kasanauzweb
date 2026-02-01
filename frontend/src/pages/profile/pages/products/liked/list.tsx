import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableWidget from "@/components/web/datatable";
import { useTranslation } from "react-i18next";
import { onlineShopApi } from "@/server";
import CheckboxWidget from "@/components/web/Form/checkbox";
import { ProductType } from "@/types/onlineshop";
import axios from "axios";
import { useOnlineShopContext } from "@/context/onlineshop";

interface CategoryTagProps {
  meta: string;
  icon?: string;
  title: string;
}

const CategoryTag: React.FC<CategoryTagProps> = (props) => {
  return (
    <Link
      to={`/online-shop/categories/${props.meta}`}
      className="flex items-center justify-center min-w-max py-1.5 px-3 bg-tbrand text-brand rounded-full"
    >
      {props.icon && (
        <span className="icon">
          <img src={props.icon} alt="" className="w-3.5 h-3.5 mr-2" />
        </span>
      )}
      <span className="text">{props.title}</span>
    </Link>
  );
};

const ListPage: React.FC = () => {
  const { t } = useTranslation();
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });
  const { userLikedProducts, fetchUserLikedProducts } = useOnlineShopContext();

  useEffect(() => {
    fetchUserLikedProducts();
  }, []);

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-4xl font-bold">Yoqtirgan maxsulotlarim</h2>
      </div>

      <div className="content list-products overflow-x-auto">
        {userLikedProducts.length === 0 ? (
          <>
            <p className="text-center text-description font-medium">
              Foydalanuvchi yoqtirgan maxsulotlari topilmadi
            </p>
          </>
        ) : (
          <DatatableWidget
            columns={[
              {
                name: <CheckboxWidget htmlFor="select-all" checked={false} />,
                props: "select",
              },
              { name: t("Image[of]"), props: "image" },
              { name: t("Name[of]"), props: "name", max: true },
              { name: t("Category"), props: "category" },
              { name: t("Price"), props: "price" },
              { name: t("Active[status]"), props: "status" },
              { name: t("Actions"), props: "actions" },
            ]}
            data={userLikedProducts.map((value) => ({
              select: (
                <CheckboxWidget
                  htmlFor={`select-${value.guid}`}
                  checked={false}
                />
              ),
              image: (
                <img
                  src={`${onlineShopApi?.replace("/api/", "")}${value.image}`}
                  className="max-w-12 min-w-12 h-12 rounded-lg"
                  alt=""
                />
              ),
              name: value.title,
              category: (
                <CategoryTag
                  meta={value.category?.meta || ""}
                  title={value.category?.title || ""}
                />
              ),
              price: <span>{formatter.format(value.price)} USZ</span>,
              status: "Aktive",
              actions: <button>.</button>,
            }))}
          />
        )}
      </div>
    </>
  );
};

export default ListPage;
