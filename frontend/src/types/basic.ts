export type StateType =
  | "approved"
  | "rejected"
  | "moderation"
  | "banned"
  | "hidden";

export interface BaseModelType {
  guid: string;
  meta: string;
  state: StateType;
  created_at: string;
  updated_at: string;
}

export interface CategoryType extends BaseModelType {
  title: string;
}
