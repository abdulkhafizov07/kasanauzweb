import React from "react";
import { useTranslation } from "react-i18next";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import Logo from "@/assets/logo.svg";
import { ChartPieIcon, LogsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import { generateAdminAsideLinks } from "./aside-generate";
import { hasAll, hasOne } from "@/lib/has-perm";

export const AdminAsideComponent: React.FC = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "admin.sidebar" });
    const location = useLocation();
    const { user } = useAuth();
    const role = user?.role;
    const permissions = user?.permissions || {};

    const adminLinks = generateAdminAsideLinks(t).filter((item) =>
        role === "admin" ? true : hasAll(permissions || {}, item.requiredAll)
    );

    return (
        <Sidebar collapsible="icon" className="border-none">
            <SidebarHeader className="py-3">
                <Link to="/" className="h-11 px-2 p-2.5">
                    <img src={Logo} alt="Kasana.UZ" className="h-full" />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <h1 className="text-yellow-500 font-medium uppercase">
                            Hisobot va Tahlil
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        to="/admin/overview"
                                        className={
                                            location.pathname.includes(
                                                "/admin/overview"
                                            )
                                                ? cn("text-brand font-semibold")
                                                : cn(
                                                      "text-black/60 font-normal"
                                                  )
                                        }
                                    >
                                        <ChartPieIcon className="w-4 h-4" />
                                        <span>Statistika</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        <h1 className="text-yellow-500 font-medium uppercase">
                            Asosiy
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        {adminLinks.map((menu, index) => {
                            const isParentActive =
                                location.pathname === menu.link ||
                                menu.sub.some((sub) =>
                                    location.pathname.startsWith(sub.link)
                                ) ||
                                menu.isub?.some((sub) =>
                                    location.pathname.startsWith(sub)
                                );

                            return (
                                <SidebarMenu key={index}>
                                    <SidebarMenuButton
                                        asChild
                                        variant="default"
                                    >
                                        <Link
                                            to={menu.link}
                                            className={
                                                isParentActive
                                                    ? cn(
                                                          "text-brand font-semibold"
                                                      )
                                                    : cn(
                                                          "text-black/60 font-normal"
                                                      )
                                            }
                                        >
                                            {menu.label}
                                        </Link>
                                    </SidebarMenuButton>

                                    <SidebarMenuSub>
                                        {menu.sub
                                            .filter((subItem) =>
                                                role === "admin"
                                                    ? true
                                                    : hasOne(
                                                          permissions || {},
                                                          subItem.required
                                                      )
                                            )
                                            .map((subItem, subIndex) => {
                                                const isSubActive =
                                                    location.pathname ===
                                                    subItem.link;
                                                return (
                                                    <SidebarMenuSubItem
                                                        key={subIndex}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={
                                                                isSubActive
                                                                    ? cn(
                                                                          "text-brand font-semibold"
                                                                      )
                                                                    : cn(
                                                                          "text-black/60 font-normal"
                                                                      )
                                                            }
                                                        >
                                                            <Link
                                                                to={
                                                                    subItem.link
                                                                }
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                    </SidebarMenuSub>
                                </SidebarMenu>
                            );
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        <h1 className="text-yellow-500 font-medium uppercase">
                            Tizim
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        to="/admin/logs"
                                        className={
                                            location.pathname.includes(
                                                "/admin/logs"
                                            )
                                                ? cn("text-brand font-semibold")
                                                : cn(
                                                      "text-black/60 font-normal"
                                                  )
                                        }
                                    >
                                        <LogsIcon className="w-4 h-4" />
                                        <span>Loglar</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};
