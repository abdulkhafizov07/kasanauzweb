import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useUserContext } from "../../context/user";
import ProfileSideBarComponent from "@/components/web/profile/aside";

const ProfileLayout: React.FC = () => {
  const { isAuthenticated, loading } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/auth/sign-in/");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="profile-container bg-[#F5F5F5] pt-4 pb-2">
      <div className="container mx-auto max-w-[1366px] px-4">
        <div className="breadcrumb"></div>
        <div className="content flex items-start justify-start gap-x-4">
          <div className="content-aside min-w-3/12 max-w-3/12">
            <ProfileSideBarComponent />
          </div>
          <div
            className={
              "content-main w-full rounded-lg " +
              String(
                location.pathname.includes("notifications")
                  ? "bg-transparent"
                  : "bg-white p-4"
              )
            }
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
