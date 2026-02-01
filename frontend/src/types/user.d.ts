export interface v2Update_BasicDisplayUserType {
  guid: string
  pfp: string
  first_name: string
  last_name: string
}

export interface v2Update_UserType extends v2Update_BasicDisplayUserType {
  middle_name: string
}
