import { FC } from "react";
import { coursesApi } from "@/server";
import { Course } from "@/types/courses";
import { Link } from "react-router-dom";

const CourseComponent: FC<Course> = ({
  thumbnail,
  title,
  short_description,
  meta,
}) => {
  const apiBaseUrl = coursesApi?.replace("/api/", "");

  return (
    <Link to={`/courses/_/${meta}`} data-aos="fade-up">
      <div className="card block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {thumbnail && (
          <div className="card-image aspect-[13/9] w-full">
            <img
              src={`${apiBaseUrl}${thumbnail}`}
              alt={title}
              className="object-cover h-full rounded-lg"
            />
          </div>
        )}

        <div className="card-body p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-4">{short_description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseComponent;
