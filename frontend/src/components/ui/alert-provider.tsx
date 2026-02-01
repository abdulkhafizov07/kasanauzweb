import React, { createContext, useState, useCallback } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DialogData = {
    id: string;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
};

type AlertDialogContextType = {
    showAlert: (
        title: string,
        options: Omit<DialogData, "id" | "title">
    ) => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | null>(null);

export const AlertDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [dialogs, setDialogs] = useState<DialogData[]>([]);

    const showAlert = useCallback(
        (title: string, options: Omit<DialogData, "id" | "title">) => {
            const id = crypto.randomUUID();
            setDialogs((prev) => [...prev, { id, title, ...options }]);
        },
        []
    );

    const closeDialog = (id: string) => {
        setDialogs((prev) => prev.filter((d) => d.id !== id));
    };

    return (
        <AlertDialogContext.Provider value={{ showAlert }}>
            {children}
            {dialogs.length > 0 &&
                (() => {
                    const dialog = dialogs[0];
                    return (
                        <AlertDialog
                            key={dialog.id}
                            open
                            onOpenChange={(open) =>
                                !open && closeDialog(dialog.id)
                            }
                        >
                            <AlertDialogTrigger asChild />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {dialog.title}
                                    </AlertDialogTitle>
                                    {dialog.description && (
                                        <AlertDialogDescription>
                                            {dialog.description}
                                        </AlertDialogDescription>
                                    )}
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    {dialog.cancelText && (
                                        <AlertDialogCancel>
                                            {dialog.cancelText}
                                        </AlertDialogCancel>
                                    )}
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (dialog.onConfirm)
                                                dialog.onConfirm();
                                            closeDialog(dialog.id);
                                        }}
                                    >
                                        {dialog.confirmText || "Tushunarli"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    );
                })()}
        </AlertDialogContext.Provider>
    );
};

export { AlertDialogContext };
