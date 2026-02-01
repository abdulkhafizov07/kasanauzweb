export interface AnnouncementAdminColumnType {
  announcement_type: "work_announcement" | "service_announcement";
  guid: string;
  title: string;
  state: "verified" | "hidden" | "banned" | "draft";
  price: string;
  dealed: boolean;
  created_at: string;
}
