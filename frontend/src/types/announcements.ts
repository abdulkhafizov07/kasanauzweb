import { User } from "./admin/users";

export interface AnnouncementType {
  guid: string;
  announcement_type: "service_announcement" | "work_announcement";
  meta: string;
  title: string;
  dealed: boolean;
  description: string;
  short_description: string;
  price_min: number;
  price_max: number;
  work_time: string;
  user: User;
  views: number;
  address: string;
  thumbnail: string;
  argued: string;
  region: number;
  district: number;
  experience: string;
  is_verified: boolean;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
}

export interface CreateAnnouncementType {
  annoucement_type: string;
  name: string;
  price_min: number;
  price_max: number;
  negotiate: boolean;
  region: number;
  district: number;
  address: string;
  experience: string;
  work_time: string;
  description: string;
  images: File[];
}

export interface CreateAnnouncementErrorType {
  annoucement_type?: string;
  name?: string;
  price_min?: string;
  price_max?: string;
  negotiate?: string;
  region?: string;
  district?: string;
  address?: string;
  experience?: string;
  work_time?: string;
  description?: string;
  images?: string;
}

export interface LoadUserAnnouncementsProps {
  page?: number;
  number?: number;
}

export interface Announcement {
  title: string;
  thumbnail: string;
  price_min: number;
  state:string;
  price_max: number;
  short_description: string;
}
