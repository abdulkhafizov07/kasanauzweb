import React, { createContext, useContext, useState } from 'react'
import { AuthState, User, LoginResponse, UserRole } from '../types/auth'
import api from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext<AuthState | undefined>(undefined)

async function verifyToken(): Promise<{
  isAuthenticated: boolean
  role: UserRole | null
}> {
  const token = localStorage.getItem('accessToken')
  if (!token) return { isAuthenticated: false, role: null }

  try {
    await api.post('/users/api/auth/verify-token/', { token })
    const user = jwtDecode(token) as { role: UserRole }

    return {
      isAuthenticated: true,
      role: user.role ? user.role : null,
    }
  } catch {
    return { isAuthenticated: false, role: null }
  }
}

export async function fetchUserProfile(): Promise<User | null> {
  try {
    const response = await api.get('/users/api/profile/')
    return response.data
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [userEnabled, setUserEnable] = useState(false)

  const { data: authData, isLoading: verifying } = useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: verifyToken,
  })
  const { data: profile, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: fetchUserProfile,
    enabled: userEnabled,
  })

  const isAuthenticated = authData?.isAuthenticated ?? false
  const user = { role: authData?.role || null, ...profile }
  const isLoading = verifying

  const login = async (
    phone: string,
    password: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post(
        '/users/api/auth/login/',
        { phone, password },
        { headers: { 'Content-Type': 'application/json' } },
      )

      localStorage.setItem('accessToken', response.data.access_token)
      localStorage.setItem('refreshToken', response.data.refresh_token)

      await queryClient.invalidateQueries({
        queryKey: ['auth', 'verify'],
      })

      return {
        success: true,
        code: 200,
        title: 'Autentifikatsiya muvaffaqiyatli',
        description: 'Siz tizimga muvaffaqiyatli kirishingiz mumkin.',
        user: undefined,
      }
    } catch (error: any) {
      return {
        success: false,
        code: error.response?.status || 0,
        title: 'Login xatoligi',
        description:
          error.response?.data?.error ||
          `Kutilmagan xatoli ko'di: ${error.status}`,
      }
    }
  }

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const accessToken = localStorage.getItem('accessToken')
    api
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/api/auth/logout/`, {
        refresh: refreshToken,
        access: accessToken,
      })
      .then(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        queryClient.setQueryData(['auth', 'verify'], {
          isAuthenticated: false,
        })
        queryClient.removeQueries({ queryKey: ['auth', 'profile'] })
      })
  }

  const getUserProfile = () => {
    setUserEnable(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isUserLoading,
        user,
        login,
        logout,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
