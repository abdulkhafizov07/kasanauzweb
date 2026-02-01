import { useContext } from "react";
import { AlertDialogContext } from "@/components/ui/alert-provider";

export const useAlertDialog = () => {
    const ctx = useContext(AlertDialogContext);
    if (!ctx)
        throw new Error(
            "useAlertDialog must be used within AlertDialogProvider"
        );
    return ctx.showAlert;
};
