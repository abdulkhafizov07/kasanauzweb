import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import api from "@/lib/api";
import { NewsCategory } from "@/types/news";

async function fetchCategories(): Promise<NewsCategory[]> {
    const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/news/api/categories/`
    );
    return res.data;
}

export const RightSide: React.FC = () => {
    const { t } = useTranslation();

    const {
        data: categories,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["news-categories"],
        queryFn: fetchCategories,
    });

    if (isLoading) {
        return (
            <div className="w-full h-auto bg-white rounded-lg px-3 py-4">
                <h1 className="text-2xl text-black font-bold">
                    {t("Categories")}
                </h1>
                <p className="text-description mt-2">{t("Loading...")}</p>
            </div>
        );
    }

    if (isError || !categories) {
        return (
            <div className="w-full h-auto bg-white rounded-lg px-3 py-4">
                <h1 className="text-2xl text-black font-bold">
                    {t("Categories")}
                </h1>
                <p className="text-red-500 mt-2">
                    {t("Failed to load categories")}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-auto bg-white rounded-lg px-3 py-4">
            <h1 className="text-2xl text-black font-bold">{t("Categories")}</h1>

            <div className="flex flex-col items-start justify-start space-y-1 mt-3">
                {categories.map((category) => (
                    <Link
                        to="/news/categories/$meta"
                        params={{ meta: category.meta }}
                        key={category.meta}
                        className="text-description font-semibold"
                    >
                        {category.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};
