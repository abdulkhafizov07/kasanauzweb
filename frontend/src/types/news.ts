import { ReactNode } from 'react'
import { UserType } from './user'

export interface NewsCategory {
  guid: string
  meta: string
  title: string
  state: string
  created_at: string
}

export interface NewsItem {
  guid: string
  meta: string
  category: NewsCategory
  user: UserType
  title: string
  thumbnail: string
  description: string
  short_description?: string
  views: number
  state: string
  created_at: string
}

export interface HomeDataResponse {
  categories: NewsCategory[]
  banner: NewsItem[]
  week: NewsItem[]
}

export interface DocumentType {
  guid: string
  doc_type: string
  title: string
  subtitle: string
  link?: string
  file?: string
}

export interface NewsContextType {
  categories: NewsCategory[]
  bannerNews: NewsItem[]
  weekNews: NewsItem[]
  loading: boolean
  legacyDocuments: DocumentType[]
  bussiniesDocuments: DocumentType[]
  fetchData: () => Promise<void>
}

export interface NewsProviderProps {
  children: ReactNode
}

export interface HomePageDocumentsSectionData {
  legacyDocuments: DocumentType[]
  bussiniesDocuments: any[]
}
