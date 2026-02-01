import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserAdminColumnType } from "@/types/admin/users";
import { TFunction } from "i18next";
import { ComponentIcon, TerminalIcon } from "lucide-react";
import axios from "axios";
import { usersApi } from "@/server";
import { toast } from "sonner";

export const PromoteComponent: React.FC<{
  t: TFunction;
  rowUser: UserAdminColumnType;
  fetchData: () => void;
}> = ({ t, rowUser, fetchData }) => {
  const promoteUser = async (role: "user" | "moderator" | "admin") => {
    const isDemotion = rowUser.role === role && role !== "admin";
    const newRole = isDemotion ? "user" : role;

    try {
      await axios.patch(`${usersApi}dashboard/users/promote/${rowUser.guid}/`, {
        role: newRole,
      });

      const successMessage = isDemotion
        ? t("messages.demote_success", { role: t(`roles.${role}`) })
        : t("messages.promote_success", { role: t(`roles.${role}`) });

      toast.success(successMessage);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t("messages.promote_failed"));
    }
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t("menu.admin_actions")}</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => promoteUser("moderator")}
          className="cursor-pointer"
        >
          <ComponentIcon className="mr-2 h-4 w-4" />
          <span>
            {rowUser.role === "moderator"
              ? t("menu.drop_moderator")
              : t("menu.promote_moderator")}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => promoteUser("admin")}
          className="cursor-pointer"
        >
          <TerminalIcon className="mr-2 h-4 w-4" />
          <span>{t("menu.promote_admin")}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
};
