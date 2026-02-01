import { FC } from "react";
import { coursesApi, usersApi } from "@/server";
import { CourseType } from "@/types/courses";
import { Link } from "@tanstack/react-router";

const CourseWidget: FC<{ course: CourseType; noAnimation?: boolean }> = ({
    course,
    noAnimation = false,
}) => {
    return (
        <Link
            to="/courses/details/$meta"
            params={{ meta: course.meta }}
            data-aos={noAnimation ? "" : "fade-up"}
        >
            <div className="card block bg-transparent rounded-lg overflow-hidden">
                {course.thumbnail && (
                    <div className="card-image aspect-[13/9] w-full">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="object-cover h-full rounded-lg"
                        />
                    </div>
                )}

                <div className="card-body pt-2">
                    <p className="text-brand mb-2">{course.category.title}</p>

                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {course.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-2">
                        {course.short_description
                            ? course.short_description.split(".")[0]
                            : course.description.split(".")[0]}
                    </p>

                    <div className="flex items-center justify-start space-x-2">
                        <img
                            src={course.author.pfp}
                            alt={`${course.author.first_name} ${course.author.last_name}`}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>
                            {course.author.first_name} {course.author.last_name}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseWidget;
