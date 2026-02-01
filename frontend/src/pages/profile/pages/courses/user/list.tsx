import React from "react";
import { useCoursesContext } from "@/context/courses";
import CourseWidget from "@/components/web/courses/course";

const ListPage: React.FC = () => {
  const { userSubedCourses } = useCoursesContext();

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-4xl font-bold">Kurslarim</h2>
      </div>

      <div className="content list-products overflow-x-auto">
        {userSubedCourses.length === 0 ? (
          <>
            <p className="text-center text-description font-medium">
              Foydalanuvchi ro'yhatga olingan kurslar topilmadi
            </p>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {userSubedCourses.map((value, index) => (
              <CourseWidget key={index} course={value} noanim />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ListPage;
