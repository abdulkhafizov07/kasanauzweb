import {
    GraduationCapIcon,
    MegaphoneIcon,
    NewspaperIcon,
    ShoppingCartIcon,
    UsersIcon,
} from "lucide-react";

export const generateAdminAsideLinks = (t: any) => [
    {
        label: (
            <>
                <UsersIcon className="w-4" />
                <span>{t("users")}</span>
            </>
        ),
        link: "/admin/users",
        requiredAll: ["users:read"],
        sub: [
            {
                label: t("users"),
                link: "/admin/users/all",
                required: "users:read_all",
            },
            {
                label: t("housemakers"),
                link: "/admin/users/housemaker",
                required: "users:read_housemaker",
            },
            {
                label: t("admins"),
                link: "/admin/users/admin",
                required: "users:read_admin",
            },
            {
                label: t("moderators"),
                link: "/admin/users/moderator",
                required: "users:read_moderators",
            },
        ],
        isub: ["/admin/users/create"],
    },
    {
        label: (
            <>
                <ShoppingCartIcon className="w-4" />
                <span>{t("onlineshop")}</span>
            </>
        ),
        link: "/admin/onlineshop",
        requiredAll: ["onlineshop:read"],
        sub: [
            {
                label: t("products"),
                link: "/admin/onlineshop/products",
                required: "onlineshop:read_products",
            },
            {
                label: t("categories"),
                link: "/admin/onlineshop/categories",
                required: "onlineshop:read_categories",
            },
        ],
    },
    {
        label: (
            <>
                <GraduationCapIcon className="w-4" />
                <span>{t("courses")}</span>
            </>
        ),
        link: "/admin/courses",
        requiredAll: ["courses:read"],
        sub: [
            {
                label: t("courses"),
                link: "/admin/courses/courses",
                required: "courses:read_courses",
            },
            {
                label: t("categories"),
                link: "/admin/courses/categories",
                required: "courses:read_categories",
            },
        ],
    },
    {
        label: (
            <>
                <MegaphoneIcon className="w-4" />
                <span>{t("announcements")}</span>
            </>
        ),
        link: "/admin/announcements",
        requiredAll: ["announcements:read"],
        sub: [
            {
                label: t("all"),
                link: "/admin/announcements/all",
                required: "announcements:read_all",
            },
            {
                label: t("work announcements"),
                link: "/admin/announcements/work",
                required: "announcements:read_work",
            },
            {
                label: t("service announcements"),
                link: "/admin/announcements/service",
                required: "announcements:read_service",
            },
        ],
        isub: ["/admin/announcements/create"],
    },
    {
        label: (
            <>
                <NewspaperIcon className="w-4" />
                <span>{t("news")}</span>
            </>
        ),
        link: "/admin/news",
        requiredAll: ["news:read"],
        sub: [
            {
                label: t("news"),
                link: "/admin/news/news",
                required: "news:read_news",
            },
            {
                label: t("categories"),
                link: "/admin/news/categories",
                required: "news:read_categories",
            },
            {
                label: t("documents"),
                link: "/admin/news/documents",
                required: "news:read_documents",
            },
        ],
    },
];
