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
import { ProductCategoryAdminColumnType } from "@/types/admin/onlineshop";
import { Link } from "react-router-dom";

export const generateColumns = (
  t: TFunction,
  deleteCategory: (guid: string) => Promise<void>,
  editCategory: (guid: string) => Promise<void>
): ColumnDef<ProductCategoryAdminColumnType>[] => {
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
      meta: { className: "w-3/4" },
      cell: ({ row }) => (
        <>
          <div className="capitalize">{row.getValue("title")}</div>
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
        const rowCategory = row.original;

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
                    to="#edit"
                    className="cursor-pointer"
                    onClick={() => editCategory(rowCategory.guid)}
                  >
                    <span className="icon">
                      <EditIcon />
                    </span>
                    <span className="text">{t("menu.edit")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild>
                  <Link
                    to={"#delete"}
                    className="cursor-pointer"
                    onClick={() => deleteCategory(rowCategory.guid)}
                  >
                    <span className="icon">
                      <TrashIcon />
                    </span>
                    <span className="text">{t("menu.delete")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
