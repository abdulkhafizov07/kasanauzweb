import React from "react";
import DatatableWidget from "@/components/web/datatable";
import { useTranslation } from "react-i18next";
import { announcementsApi, onlineShopApi } from "@/server";
import CheckboxWidget from "@/components/web/Form/checkbox";
import { useAnnouncements } from "@/context/announcements";

interface CategoryTagProps {
  meta: string;
  icon?: string;
  title: string;
}

const ListPage: React.FC = () => {
  const { t } = useTranslation();
  const { userSavedAnnouncements } = useAnnouncements();
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-4xl font-bold">Saqlagan e`lonlarim</h2>
      </div>

      <div className="content list-products overflow-x-auto">
        {userSavedAnnouncements.length === 0 ? (
          <>
            <p className="text-center text-description font-medium">
              Foydalanuvchi saqlagan e`lonlari topilmadi
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
              { name: t("Price"), props: "price" },
              { name: t("Active[status]"), props: "status" },
              { name: t("Actions"), props: "actions" },
            ]}
            data={userSavedAnnouncements.map((value) => ({
              select: (
                <CheckboxWidget
                  htmlFor={`select-${value.guid}`}
                  checked={false}
                />
              ),
              image: (
                <img
                  src={`${announcementsApi?.replace("/api/", "")}${
                    value.thumbnail
                  }`}
                  className="max-w-12 min-w-12 h-12 rounded-lg"
                  alt=""
                />
              ),
              name: value.title,
              price: value.dealed ? (
                <span>Kelishilingan</span>
              ) : (
                <span>
                  {formatter.format(value.price_min)}-
                  {formatter.format(value.price_max)} USZ
                </span>
              ),
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
