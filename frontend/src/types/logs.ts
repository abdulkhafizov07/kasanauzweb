interface LogType {
  guid: string;
  user_guid: string;
  user_first_name: string;
  user_last_name: string;
  user_middle_name?: string;
  user_phone: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | string;
  description: string;
  meta_data: Record<string, any>;
  created_at: string;
}
