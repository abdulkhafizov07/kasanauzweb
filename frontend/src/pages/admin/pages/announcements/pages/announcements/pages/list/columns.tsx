import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { VisibilityComponent } from "./visiblity";
import { AnnouncementAdminColumnType } from "@/types/admin/announcement";

export const generateColumns = (
  t: TFunction,
  fetchData: () => void
): ColumnDef<AnnouncementAdminColumnType>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: t("columns.title"),
      meta: { className: "w-1/2" },
      cell: ({ row }) => (
        <>
          <div className="capitalize">{row.getValue("title")}</div>
        </>
      ),
    },
    {
      accessorKey: "price",
      meta: { className: "w-1/4" },
      header: t("columns.price"),
      cell: ({ row }) => (
        <>
          <div className="capitalize">
            {row.original.dealed
              ? "Kelishiladi"
              : `${row.getValue("price")} SO'M`}
          </div>
        </>
      ),
    },
    {
      accessorKey: "created_at",
      meta: { className: "w-1/4" },
      header: t("columns.created_at"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowAnnouncement = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("menu.open")}</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("menu.actions")}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/admin/announcements/${
                      rowAnnouncement.announcement_type === "work_announcement"
                        ? "work"
                        : "service"
                    }/edit/${rowAnnouncement.guid}`}
                    className="cursor-pointer"
                  >
                    <span className="icon">
                      <EditIcon />
                    </span>
                    <span className="text">{t("menu.edit")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild variant="destructive">
                  <Link
                    to={
                      "/admin/announcements/products/delete/" +
                      rowAnnouncement.guid
                    }
                    className="cursor-pointer"
                  >
                    <span className="icon">
                      <TrashIcon />
                    </span>
                    <span className="text">{t("menu.delete")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <VisibilityComponent
                t={t}
                rowProduct={rowAnnouncement}
                fetchData={fetchData}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
