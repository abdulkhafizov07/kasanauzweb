import { v2Update_BasicDisplayUserType } from './user.d'

export interface v2Update_BasicDisplayCourseCategoryType {
  meta: string
  title: string
}

export interface v2Update_CourseCategoryType
  extends v2Update_BasicDisplayCourseCategoryType {
  created_at?: string
  updated_at?: string
}

export interface v2Update_BasicDisplayCourseType {
  guid: string
  meta: string
  category: v2Update_BasicDisplayCourseCategoryType
  thumbnail: string
  title: string
  short_description: string
  description?: string
  views?: number
  subscriptions: number
  lessons: number
  duration: number
  rating: number
  author: v2Update_BasicDisplayUserType
  created_at: string
}
