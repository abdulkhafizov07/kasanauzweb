import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import DatatableWidget from "@/components/web/datatable";
import { useTranslation } from "react-i18next";
import CheckboxWidget from "@/components/web/Form/checkbox";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface Announcement {
  guid: string;
  title: string;
  thumbnail: string;
  price_min: number;
  price_max: number;
  dealed: boolean;
}

async function fetchUserSavedAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/announcements/api/user-saved/`,
  );
  return data;
}

export const Route = createFileRoute(
  "/_authenticated/profile/_profileLayout/saved-announcements",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data: userSavedAnnouncements = [], isLoading } = useQuery({
    queryKey: ["userSavedAnnouncements"],
    queryFn: fetchUserSavedAnnouncements,
  });

  const [selected, setSelected] = useState<string[]>([]);

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? userSavedAnnouncements.map((v) => v.guid) : []);
  };

  const toggleOne = (guid: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, guid] : prev.filter((id) => id !== guid),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold">
          {t("Saqlangan e’lonlarim")}
        </h2>
      </div>

      <div className="content">
        {isLoading ? (
          <p className="text-center text-gray-500">{t("Yuklanmoqda...")}</p>
        ) : userSavedAnnouncements.length === 0 ? (
          <p className="text-center text-description font-medium">
            {t("Saqlangan e’lonlar topilmadi")}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div className="w-full overflow-x-auto">
              <DatatableWidget
                columns={[
                  {
                    name: (
                      <CheckboxWidget
                        htmlFor="select-all"
                        checked={
                          selected.length === userSavedAnnouncements.length &&
                          selected.length > 0
                        }
                        onChange={(e) =>
                          toggleAll((e.target as HTMLInputElement).checked)
                        }
                      />
                    ),
                    props: "select",
                  },
                  { name: t("Rasm"), props: "image" },
                  { name: t("Nomi"), props: "name", max: true },
                  { name: t("Narxi"), props: "price" },
                  { name: t("Holati"), props: "status" },
                  { name: t("Amallar"), props: "actions" },
                ]}
                data={userSavedAnnouncements.map((value) => ({
                  select: (
                    <CheckboxWidget
                      htmlFor={`select-${value.guid}`}
                      checked={selected.includes(value.guid)}
                      onChange={(e) =>
                        toggleOne(
                          value.guid,
                          (e.target as HTMLInputElement).checked,
                        )
                      }
                    />
                  ),
                  image: (
                    <div className="aspect-[13/9] w-26">
                      <img
                        src={value.thumbnail}
                        className="h-full w-full object-cover rounded-lg"
                        alt={value.title}
                      />
                    </div>
                  ),
                  name: (
                    <span className="font-medium text-gray-800">
                      {value.title}
                    </span>
                  ),
                  price: value.dealed ? (
                    <span className="text-green-600 font-medium">
                      {t("Kelishilgan")}
                    </span>
                  ) : (
                    <span>
                      {formatter.format(value.price_min)} –{" "}
                      {formatter.format(value.price_max)} UZS
                    </span>
                  ),
                  status: (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                      {t("Faol")}
                    </span>
                  ),
                  actions: (
                    <button
                      type="button"
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      …
                    </button>
                  ),
                }))}
              />
            </div>

            {selected.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  {t("Tanlanganlarni o‘chirish")} ({selected.length})
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
