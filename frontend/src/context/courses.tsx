import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { coursesApi } from "../server";

import {
  CourseCategory,
  CourseType,
  CoursesContextType,
  CoursesProviderProps,
} from "@/types/courses";

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const CoursesProvider: React.FC<CoursesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [topCourses, setCoursesTop] = useState<CourseType[]>([]);
  const [newCourses, setNewCourses] = useState<CourseType[]>([]);
  const [userLikedCourses, setUserLikedCourses] = useState<CourseType[]>([]);
  const [userSubedCourses, setUserSubedCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${coursesApi}home-data/`);
      if (response.status === 200) {
        setCategories(response.data.categories);
        setCoursesTop(response.data.top);
        setNewCourses(response.data.new);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikedCourses = async () => {
    axios
      .get(`${coursesApi}user-liked-courses/`)
      .then((res) => {
        if (res.status === 200 && res.data) {
          setUserLikedCourses(res.data);
        }
      })
      .catch(() => {});
  };

  const fetchUserSubedCourses = async () => {
    axios
      .get(`${coursesApi}user-subed-courses/`)
      .then((res) => {
        if (res.status === 200 && res.data) {
          setUserSubedCourses(res.data);
        }
      })
      .catch(() => {});
  };

  const addToLiked = (course: CourseType) => {
    setUserLikedCourses((prev) => [...prev, course]);
  };

  const removeFromLiked = (course: CourseType) => {
    setUserLikedCourses((prev) =>
      prev.filter((value) => value.guid !== course.guid)
    );
  };

  const addToSubed = (course: CourseType) => {
    setUserSubedCourses((prev) => [...prev, course]);
  };

  const removeFromSubed = (course: CourseType) => {
    setUserSubedCourses((prev) =>
      prev.filter((value) => value.guid !== course.guid)
    );
  };

  return (
    <CoursesContext.Provider
      value={{
        categories,
        topCourses,
        newCourses,
        userLikedCourses,
        userSubedCourses,
        addToLiked,
        removeFromLiked,
        addToSubed,
        removeFromSubed,
        loading,
        fetchData,
        fetchUserLikedCourses,
        fetchUserSubedCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export const useCoursesContext = (): CoursesContextType => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCoursesContext must be used within a CoursesProvider");
  }
  return context;
};

export { CoursesContext, CoursesProvider };
