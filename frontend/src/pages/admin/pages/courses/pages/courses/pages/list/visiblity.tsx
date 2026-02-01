import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ProductAdminColumnType } from "@/types/admin/onlineshop";
import { TFunction } from "i18next";
import { BanIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { coursesApi } from "@/server";
import { toast } from "sonner";

export const VisibilityComponent: React.FC<{
  t: TFunction;
  rowProduct: ProductAdminColumnType;
  fetchData: () => void;
}> = ({ t, rowProduct, fetchData }) => {
  const changeProductState = async (
    state: "verified" | "banned" | "hidden"
  ) => {
    try {
      await axios.patch(
        `${coursesApi}dashboard/course/status/${rowProduct.guid}/`,
        {
          state,
        }
      );

      toast.success(t("messages.state_change_success", { state }));
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t("messages.state_change_failed"));
    }
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t("menu.product_actions")}</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => changeProductState("verified")}
          className="cursor-pointer"
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          <span>{t("menu.mark_visible")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeProductState("hidden")}
          className="cursor-pointer"
        >
          <EyeOffIcon className="mr-2 h-4 w-4" />
          <span>{t("menu.mark_hidden")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeProductState("banned")}
          className="cursor-pointer"
        >
          <BanIcon className="mr-2 h-4 w-4" />
          <span>{t("menu.mark_banned")}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
};
