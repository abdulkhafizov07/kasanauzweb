import React, { useEffect } from "react";
import image404 from "@/pages/NotFoundPage/images.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "404 sahifa topilmadi - Kasana.UZ Dashboard";
  }, []);

  return (
    <>
      <div className="page w-full h-[calc(100vh-68px)] flex items-center justify-center flex-col">
        <div className="aspect-square w-64 lg:w-96 mb-12">
          <img
            src={image404}
            alt="404 not found image"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-4xl font-semibold text-brand mb-4">
          Siz izlagan sahifa topilmadi
        </h1>
        <Button asChild>
          <Link to={"/admin/overview/"}>Boshiga qaytish</Link>
        </Button>
      </div>
    </>
  );
};
