import { v2Update_BasicDisplayCourseType } from '@/types/course'
import { Link } from '@tanstack/react-router'

export default function CourseCardComponent({
  course,
}: {
  course: v2Update_BasicDisplayCourseType
}) {
  return (
    <Link
      to="/courses/details/$meta"
      params={{ meta: course.meta }}
      className="course-card group block cursor-pointer"
    >
      <div className="aspect-14/9 overflow-hidden rounded-xl">
        <img
          src={course.thumbnail}
          alt=""
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-300 ease-in group-hover:scale-110"
        />
      </div>

      <div className="course-card-body mt-4">
        <Link
          to="/courses/category/$meta"
          params={{ meta: course.category.meta }}
          className="text-brand mb-2 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          {course.category.title}
        </Link>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-brand transition-colors duration-300 ease-in">
          {course.title}
        </h3>

        <p className="text-description">{course.short_description}</p>

        <hr className="mt-3" />
      </div>
    </Link>
  )
}
