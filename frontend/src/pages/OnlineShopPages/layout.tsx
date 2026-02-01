import { useOnlineShopContext } from "@/context/onlineshop";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const OnlineShopLayout: React.FC = () => {
  const { fetchData } = useOnlineShopContext();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};
