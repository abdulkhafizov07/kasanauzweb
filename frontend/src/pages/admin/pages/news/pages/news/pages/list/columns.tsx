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
import { ProductAdminColumnType } from "@/types/admin/onlineshop";
import { VisibilityComponent } from "./visiblity";

export const generateColumns = (
  t: TFunction,
  fetchData: () => void
): ColumnDef<ProductAdminColumnType>[] => {
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
      accessorKey: "short_description",
      meta: { className: "w-1/4" },
      header: t("columns.short_description"),
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
        const rowProduct = row.original;

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
                    to={"/admin/news/news/edit/" + rowProduct.guid}
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
                    to={"/admin/news/news/delete/" + rowProduct.guid}
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
                rowProduct={rowProduct}
                fetchData={fetchData}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
