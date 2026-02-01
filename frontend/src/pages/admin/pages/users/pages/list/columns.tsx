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
import { PromoteComponent } from "./promote";
import { UserAdminColumnType } from "@/types/admin/users";

export const generateColumns = (
  t: TFunction,
  fetchData: () => void,
  userContext: any
): ColumnDef<UserAdminColumnType>[] => {
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
      accessorKey: "full_name",
      header: t("columns.full_name"),
      meta: { className: "w-1/3" },
      cell: ({ row }) => (
        <>
          <div className="capitalize">{row.getValue("full_name")}</div>
        </>
      ),
    },
    {
      accessorKey: "phone",
      meta: { className: "w-1/2" },
      header: t("columns.phone"),
    },
    {
      accessorKey: "created_at",
      meta: { className: "w-1/3" },
      header: t("columns.created_at"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowUser = row.original;

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
                    to={"/admin/users/edit/" + rowUser.guid}
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
                    to={"/admin/users/delete/" + rowUser.guid}
                    className="cursor-pointer"
                  >
                    <span className="icon">
                      <TrashIcon />
                    </span>
                    <span className="text">{t("menu.delete")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {userContext.user.role === "admin" ? (
                <>
                  <PromoteComponent
                    t={t}
                    rowUser={rowUser}
                    fetchData={fetchData}
                  />
                </>
              ) : (
                <></>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
