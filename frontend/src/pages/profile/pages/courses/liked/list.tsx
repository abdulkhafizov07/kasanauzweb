import CourseWidget from "@/components/web/courses/course";
import { useCoursesContext } from "@/context/courses";
import React from "react";

const ListPage: React.FC = () => {
  const { userLikedCourses } = useCoursesContext();

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-4xl font-bold">Yoqqan kurslar</h2>
      </div>

      <div className="content list-products overflow-x-auto">
        {userLikedCourses.length === 0 ? (
          <>
            <p className="text-center text-description font-medium">
              Foydalanuvchi yoqtirgan kurslar topilmadi
            </p>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {userLikedCourses.map((value, index) => (
              <CourseWidget key={index} course={value} noAnimation={true} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ListPage;
