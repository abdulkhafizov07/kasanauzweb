export interface ProductAdminColumnType {
  guid: string;
  title: string;
  state: "verified" | "hidden" | "banned" | "draft";
  price: string;
  category: string;
  created_at: string;
  [key: string]: any;
}


export interface ProductCategoryAdminColumnType {
  guid: string;
  title: string;
  created_at: string;
}
