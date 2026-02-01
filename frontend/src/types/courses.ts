import { ReactNode } from 'react'
import { UserType } from './user'

export interface TeacherUser {
  guid?: string
  first_name: string
  last_name: string
  middle_name: string
  created_at?: string
}

export interface TeacherForm extends TeacherUser {
  birthday: string
  phone: number | null
  email: string
  password: string
  gender: string
  role: string
  purposes: string
  region: string
  district: string
  about: string
  biography: string
}

export interface CourseTeacher {
  user: TeacherUser
}

export interface CourseCategory {
  guid: string
  meta: string
  title: string
  state: string
  created_ad: string
}

export interface LessonType {
  guid: string
  order: number
  video?: string
  created_at?: string
}

export interface CourseType {
  guid: string
  meta: string
  title: string
  short_description: string
  description: string
  thumbnail: string
  category: CourseCategory
  views: number
  lessons: LessonType[]
  author: UserType
  state: string
  created_at: string
}

export interface CoursesContextType {
  categories: CourseCategory[]
  topCourses: CourseType[]
  newCourses: CourseType[]
  userLikedCourses: CourseType[]
  userSubedCourses: CourseType[]
  addToLiked: (course: CourseType) => void
  removeFromLiked: (course: CourseType) => void
  addToSubed: (course: CourseType) => void
  removeFromSubed: (course: CourseType) => void
  loading: boolean
  fetchData: () => Promise<void>
  fetchUserLikedCourses: () => Promise<void>
  fetchUserSubedCourses: () => Promise<void>
}

export interface CoursesProviderProps {
  children: ReactNode
}
