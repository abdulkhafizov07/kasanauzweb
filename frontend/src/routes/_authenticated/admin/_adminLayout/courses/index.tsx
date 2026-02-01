import LoadingComponent from '@/components/web/loader'
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/courses/',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'courses:read')) &&
          auth.user?.role !== 'admin'
        ) {
          navigate({ to: '/auth/login' })
        }
      }
    }, [auth])

    return auth.isLoading || auth.isUserLoading ? (
      <LoadingComponent />
    ) : (
      <Navigate to="/admin/courses/courses" />
    )
  },
})
