import LoadingComponent from "@/components/web/loader";
import { coursesApi } from "@/server";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import banner from "@/assets/news/category-details.png";
import { CourseCategory, CourseType } from "@/types/courses";
import { useCoursesContext } from "@/context/courses";
import CourseWidget from "@/components/web/courses/course";

export const CategoryDetailsPage: React.FC = () => {
  const { meta } = useParams();
  const coursesContext = useCoursesContext();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CourseCategory | undefined>(
    undefined
  );
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    setCategory(coursesContext.categories.find((value) => value.meta === meta));
  }, [coursesContext.categories, meta]);

  useEffect(() => {
    axios
      .get(`${coursesApi}category/${meta}/`)
      .then((res) => {
        console.log(res);

        setCourses(res.data.results || []);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [meta]);

  return (
    <>
      <div className="w-full bg-background">
        {loading && coursesContext.loading ? (
          <div className="w-full min-h-[calc(100vh-148px)] flex items-center justify-center">
            <LoadingComponent />
          </div>
        ) : (
          <>
            <div className="banner w-full h-18 relative bg-white">
              <div className="container mx-auto max-w-[1366px] flex items-center h-full">
                <h3 className="text-3xl font-semibold text-brand">
                  {category?.title}
                </h3>
              </div>
              <img
                src={banner}
                alt={"Image for " + category?.title}
                className="absolute right-0 top-0 h-18"
              />
            </div>

            <div className="container mx-auto max-w-[1366px] py-4">
              <div className="grid grid-cols-4 gap-4">
                {courses.map((value, index) => (
                  <CourseWidget course={value} key={index} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
