export interface User {
  guid: string;
  first_name: string;
  last_name: string;
  phone: number;
  pfp: string;
  purposes: string;
  created_at: string;
}

export type UserType = {
  guid: string;
  pfp: string;
  about: string;
  biography: string;
  birthday: string;
  created_at: string;
  district: string;
  email: string;
  first_name: string;
  gender: number;
  last_name: string;
  phone: number;
  purposes: string;
  region: string;
  role: string;
};

export type UserAdminColumnType = {
  guid: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
};
