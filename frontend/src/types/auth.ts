export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'moderator'
  | 'user'
  | 'housemaker'

export interface User {
  guid: string
  first_name: string
  last_name: string
  middle_name: string
  pfp: string
  birthday: string
  email: string
  phone: string
  gender: number
  purposes: string
  district: string
  about: string
  biography: string
  region: string
  role: UserRole
  permissions: Record<string, string[]>
  created_at: string
}

export interface JWTUser {
  user_id: string
  role: UserRole
}

export type LoginResponse = {
  success: boolean
  code?: number
  title: string
  description: string
  user?: User
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  isUserLoading: boolean
  user: User | undefined | null
  login: (phone: string, password: string) => Promise<LoginResponse>
  logout: () => void
  getUserProfile: () => void
}
