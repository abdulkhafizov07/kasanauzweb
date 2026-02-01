import { FC, useContext } from "react";

import PosterComponent from "@/components/CoursesComponents/poster";
import Categories from "@/components/CoursesComponents/categories";

import { CoursesContext } from "@/context/courses";
import SuccessfulExperience from "@/components/CoursesComponents/successfulExperience";
import TheHistoryOfSuccess from "@/components/CoursesComponents/theHistoryOfSuccess";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CourseWidget from "@/components/web/courses/course";

export const HomePage: FC = () => {
  const context = useContext(CoursesContext);
  const { t } = useTranslation();

  document.title = `${t("Courses")} - Kasana.UZ`;

  if (!context) {
    return <div>Error: CoursesContext is undefined</div>;
  }

  const { topCourses, newCourses } = context;

  return (
    <div id="page" className="min-h-screen">
      <PosterComponent />

      <Categories />

      <section className="top-courses w-full">
        <div className="container mx-auto max-w-[1366px]">
          <div className="section-title mb-4">
            <h3 className="title text-4xl font-bold mb-1">Top kurslar 🔥</h3>
            <p className="subtitle text-lg text-text-placeholder">
              Yuqori baholangan kurslar
            </p>
          </div>

          <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {topCourses && topCourses.length > 0 ? (
              topCourses.map((course) => (
                <CourseWidget key={course.guid} course={course} />
              ))
            ) : (
              <p>Top kurslar mavjud emas.</p>
            )}
          </div>

          <Link
            to={"/"}
            className="block max-w-fit h-auto mt-4 px-3 py-2 cursor-pointer border border-sm-border text-brand font-semibold rounded-lg mx-auto hover:text-white hover:bg-brand transition-colors duration-300 ease-out"
          >
            Ko’proq ko’rish
          </Link>
        </div>
      </section>

      <SuccessfulExperience />

      <section className="new-courses w-full">
        <div className="container mx-auto max-w-[1366px]">
          <div className="section-title mb-4">
            <h3 className="title text-4xl font-bold mb-1">Yangi kurslar</h3>
            <p className="subtitle text-lg text-text-placeholder">
              Yangi yonalishlarni organing
            </p>
          </div>

          <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {newCourses && newCourses.length > 0 ? (
              newCourses.map((course) => (
                <CourseWidget key={course.guid} course={course} />
              ))
            ) : (
              <p>Yangi kurslar mavjud emas.</p>
            )}
          </div>

          <Link
            to={"/"}
            className="block max-w-fit h-auto mt-4 px-3 py-2 cursor-pointer border border-sm-border text-brand font-semibold rounded-lg mx-auto hover:text-white hover:bg-brand transition-colors duration-300 ease-out"
          >
            Ko’proq ko’rish
          </Link>
        </div>
      </section>

      <TheHistoryOfSuccess></TheHistoryOfSuccess>
    </div>
  );
};
