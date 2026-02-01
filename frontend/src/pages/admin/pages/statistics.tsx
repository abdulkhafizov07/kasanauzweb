"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  usersApi,
  onlineShopApi,
  newsApi,
  coursesApi,
  announcementsApi,
} from "@/server";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const generateHSLColors = (count: number): string[] => {
  const colors: string[] = [];
  const step = Math.floor(360 / count);
  let hue = Math.floor(Math.random() * 360);
  for (let i = 0; i < count; i++) {
    while (hue >= 180 && hue <= 250) {
      hue = (hue + step) % 360;
    }
    colors.push(`hsl(${hue}, 70%, 65%)`);
    hue = (hue + step) % 360;
  }
  return colors;
};

export const regionColors: { [region: string]: string } = {
  "Andijon viloyati": "#A5D6A7",
  "Buxoro viloyati": "#FFF176",
  "Fargʻona viloyati": "#81D4FA",
  "Jizzax viloyati": "#C8E6C9",
  "Xorazm viloyati": "#AED581",
  "Namangan viloyati": "#B2EBF2",
  "Navoiy viloyati": "#FFF9C4",
  "Qashqadaryo viloyati": "#B3E5FC",
  "Qoraqalpogʻiston Respublikasi": "#F0F4C3",
  "Samarqand viloyati": "#BBDEFB",
  "Sirdaryo viloyati": "#DCEDC8",
  "Surxondaryo viloyati": "#FFE082",
  "Toshkent viloyati": "#B2DFDB",
  "Toshkent shahri": "#E6EE9C",
};

export const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();

  const [usersData, setUsersData] = useState<any>(null);
  const [shopData, setShopData] = useState<any>(null);
  const [newsData, setNewsData] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any>(null);
  const [announcementData, setAnnouncementData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Statistikalar - Kasana.UZ Dashboard";

    Promise.all([
      axios.post(`${usersApi}dashboard/statistics`, {}),
      axios.post(`${onlineShopApi}dashboard/statistics`, {}),
      axios.post(`${newsApi}dashboard/statistics`, {}),
      axios.post(`${coursesApi}dashboard/statistics`, {}),
      axios.post(`${announcementsApi}dashboard/statistics`, {}),
    ])
      .then(([usersRes, shopRes, newsRes, coursesRes, annRes]) => {
        setUsersData(usersRes.data);
        setShopData(shopRes.data);
        setNewsData(newsRes.data);
        setCoursesData(coursesRes.data);
        setAnnouncementData(annRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Statistikani yuklashda xatolik:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-2">Yuklanmoqda...</p>;
  if (!usersData || !shopData || !newsData || !coursesData || !announcementData)
    return <p className="p-2">Ma'lumot topilmadi</p>;

  return (
    <div className="p-2 space-y-6">
      {/* Users Section */}
      <section>
        <div className="grid-title flex items-center justify-start space-x-4 mb-2">
          <h3 className="text-xl text-black/60 uppercase font-bold">
            Foydalanuvchilar statistikasi
          </h3>
          <div className="flex-grow border-b border-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Foydalanuvchilar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <ul>
                <li>
                  <b>Umumiy soni:</b> <span>{usersData.total_users}</span>
                </li>
                <li>
                  <b>Bugun qo‘shilgan:</b> <span>{usersData.today_users}</span>
                </li>
                <li>
                  <b>O‘rtacha yosh:</b>{" "}
                  <span>{usersData.average_age ?? "Mavjud emas"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Gender statistikasi</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Pie
                data={{
                  labels: Object.keys(usersData.gender_stats),
                  datasets: [
                    {
                      data: Object.values(usersData.gender_stats),
                      backgroundColor: ["#36A2EB", "#FF6384"],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>

          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className="p-0">
              <CardTitle className="text-xl">Rollar bo‘yicha</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Pie
                data={{
                  labels: Object.keys(usersData.role_stats),
                  datasets: [
                    {
                      label: "Foydalanuvchilar soni",
                      data: Object.values(usersData.role_stats),
                      backgroundColor: [
                        "#A8E6CF",
                        "#4FC3F7",
                        "#4CAF50",
                        "#1565C0",
                        "#388E3C",
                      ],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-3 p-2 gap-2"
            )}
          >
            <CardHeader className="p-0">
              <CardTitle className="text-xl">
                Hududlar bo‘yicha foydalanuvchilar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Bar
                height={100}
                data={{
                  labels: Object.keys(usersData.region_stats),
                  datasets: [
                    {
                      label: "Foydalanuvchilar soni",
                      data: Object.values(usersData.region_stats),
                      backgroundColor: Object.keys(usersData.region_stats).map(
                        (region) => regionColors[region] ?? "#ccc"
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: { title: { display: true, text: "Hudud" } },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Online Shop Section */}
      <section>
        <div className="grid-title flex items-center justify-start space-x-4 mb-2">
          <h3 className="text-xl text-black/60 uppercase font-bold">
            Onlayn bozor statistikasi
          </h3>
          <div className="flex-grow border-b border-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Onlayn bozor</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <ul>
                <li>
                  <b>Mahsulotlar soni:</b>{" "}
                  <span>{shopData.total_products ?? "?"}</span>
                </li>
                <li>
                  <b>Sotilgan mahsulotlar:</b>{" "}
                  <span>{shopData.total_sold ?? "?"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-2 gap-2 p-2"
            )}
          >
            <CardHeader className={cn("p-0")}>
              <CardTitle>Kategoriya bo‘yicha mahsulotlar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Bar
                data={{
                  labels: Object.keys(shopData.category_stats),
                  datasets: [
                    {
                      label: "Mahsulotlar soni",
                      data: Object.values(shopData.category_stats),
                      backgroundColor: generateHSLColors(
                        Object.keys(shopData.category_stats).length + 5
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: {
                      title: { display: true, text: "Toifalar" },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">
                Mahsulot ko‘rinish holati
              </CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Pie
                data={{
                  labels: [
                    "Tasdiqlanmagan mahsulotlar",
                    "Faol mahsulotlar",
                    "Faolsiz mahsulotlar",
                    "Bloklangan mahsulotlar",
                  ],
                  datasets: [
                    {
                      data: [
                        shopData.unverified_count,
                        shopData.visible_products,
                        shopData.invisible_products,
                        shopData.banned_products,
                      ],
                      backgroundColor: [
                        "#36A2EB",
                        "#FF6384",
                        "#FFCE56",
                        "#AA6384",
                      ],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News and Documents Section */}
      <section>
        <div className="grid-title flex items-center justify-start space-x-4 mb-2">
          <h3 className="text-xl text-black/60 uppercase font-bold">
            Yangiliklar va Hujjatlar Statistikasi
          </h3>
          <div className="flex-grow border-b border-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Yangiliklar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <ul>
                <li>
                  <b>Jami yangiliklar soni:</b>{" "}
                  <span>{newsData.total_news ?? "?"}</span>
                </li>
                <li>
                  <b>Jami ko‘rishlar soni:</b>{" "}
                  <span>{newsData.total_news_views ?? "?"}</span>
                </li>
                <li>
                  <b>Jami hujjatlar soni:</b> {newsData.total_documents ?? "?"}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-2 gap-2 p-2"
            )}
          >
            <CardHeader className={cn("p-0")}>
              <CardTitle>Kategoriya bo‘yicha yangiliklar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Bar
                data={{
                  labels: Object.keys(newsData.news_by_category),
                  datasets: [
                    {
                      label: "Yangiliklar soni",
                      data: Object.values(newsData.news_by_category),
                      backgroundColor: Object.keys(
                        newsData.news_by_category
                      ).map(
                        (_, i) =>
                          `hsl(${
                            (i * 360) /
                            Object.keys(newsData.news_by_category).length
                          }, 70%, 60%)`
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: { title: { display: true, text: "Toifalar" } },
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle>Hujjatlar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Pie
                data={{
                  labels: Object.keys(newsData.documents_by_type).map((key) =>
                    key === "legacy_documents"
                      ? "Qonunchilik hujjatlari"
                      : "Kichik biznes loyihalar"
                  ),
                  datasets: [
                    {
                      data: Object.values(newsData.documents_by_type),
                      backgroundColor: ["#36A2EB", "#FF6384"],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <div className="grid-title flex items-center justify-start space-x-4 mb-2">
          <h3 className="text-xl text-black/60 uppercase font-bold">
            Kurslar statistikasi
          </h3>
          <div className="flex-grow border-b border-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Asosiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <ul>
                <li>
                  <b>Jami kurslar soni:</b>{" "}
                  <span>{coursesData?.total_courses ?? "?"}</span>
                </li>
                <li>
                  <b>Jami darslar soni:</b>{" "}
                  <span>{coursesData?.total_lessons ?? "?"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-2 gap-2 p-2"
            )}
          >
            <CardHeader className={cn("p-0")}>
              <CardTitle>Kategoriya bo‘yicha kurslar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Bar
                data={{
                  labels: Object.keys(coursesData?.courses_by_category ?? {}),
                  datasets: [
                    {
                      label: "Kurslar soni",
                      data: Object.values(
                        coursesData?.courses_by_category ?? {}
                      ),
                      backgroundColor: generateHSLColors(
                        Object.keys(coursesData?.courses_by_category ?? {})
                          .length + 5
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: {
                      title: { display: true, text: "Kategoriyalar" },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* announcements Section */}
      <section>
        <div className="grid-title flex items-center justify-start space-x-4 mb-2">
          <h3 className="text-xl text-black/60 uppercase font-bold">
            E'lonlar Statistikasi
          </h3>
          <div className="flex-grow border-b border-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <Card className={cn("shadow-none rounded-lg gap-2 p-2")}>
            <CardHeader className={cn("p-0")}>
              <CardTitle className="text-xl">Umumiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <ul>
                <li>
                  <b>Jami e'lonlar soni:</b>{" "}
                  <span>{announcementData.total_announcements}</span>
                </li>
                <li>
                  <b>Jami ko‘rishlar soni:</b>{" "}
                  <span>{announcementData.total_views}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-2 gap-2 p-2"
            )}
          >
            <CardHeader className={cn("p-0")}>
              <CardTitle>E'lon turlari bo‘yicha</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Bar
                data={{
                  labels: Object.keys(announcementData.announcements_by_type),
                  datasets: [
                    {
                      label: "E'lonlar soni",
                      data: Object.values(
                        announcementData.announcements_by_type
                      ),
                      backgroundColor: generateHSLColors(
                        Object.keys(announcementData.announcements_by_type)
                          .length + 5
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: {
                      title: { display: true, text: "Turlar" },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card
            className={cn(
              "shadow-none rounded-lg col-span-1 md:col-span-3 gap-2 p-2"
            )}
          >
            <CardHeader className={cn("p-0")}>
              <CardTitle>Hududlar bo‘yicha e'lonlar</CardTitle>
            </CardHeader>
            <CardContent className={cn("p-0")}>
              <Bar
                data={{
                  labels: Object.keys(announcementData.announcements_by_region),
                  datasets: [
                    {
                      label: "E'lonlar soni",
                      data: Object.values(
                        announcementData.announcements_by_region
                      ),
                      backgroundColor: generateHSLColors(
                        Object.keys(announcementData.announcements_by_region)
                          .length + 5
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Soni" },
                    },
                    x: {
                      title: { display: true, text: "Hudud" },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
