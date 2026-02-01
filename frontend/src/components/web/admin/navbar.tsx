import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import React from "react";
import { Link } from "@tanstack/react-router";

export const AdminNavbarComponent: React.FC = () => {
    return (
        <>
            <div className="sticky top-0 admin-navbar z-40 bg-sidebar-primary-foreground">
                <div className="content flex justify-between gap-y-1 p-3">
                    <span></span>
                    <Button asChild variant={"destructive"}>
                        <Link to="/auth/logout">
                            <span className="icon">
                                <LogOutIcon />
                            </span>
                            <span className="text">Chiqish</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
};
