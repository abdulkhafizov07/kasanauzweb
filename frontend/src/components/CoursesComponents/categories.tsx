import { FC, useContext } from "react";
import { Link } from "react-router-dom";

import { CoursesContext } from "@/context/courses";
import { CourseCategory } from "@/types/courses";

const Categories: FC = () => {
  const coursesContext = useContext(CoursesContext);

  if (!coursesContext) {
    return <p>Loading categories...</p>;
  }

  const { categories } = coursesContext;

  return (
    <div id="categories" className="w-full flex items-center gap-x-2 py-2 px-4">
      <div className="relative overflow-hidden">
        <div className="list-categories flex items-center justify-start gap-x-2 overflow-scroll scrollbar-hide">
          {categories.map((category: CourseCategory) => (
            <div
              key={category.guid}
              className="min-w-fit p-3 py-1.5 bg-gray-200/75 rounded-full"
            >
              <Link to={`/courses/categories/details/${category.meta}/`}>
                {category.title}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/courses/categories/details/all"
        className="min-w-fit p-3 py-1.5 bg-brand text-white rounded-full"
      >
        Barcha kategoriyalar
      </Link>
    </div>
  );
};

export default Categories;
