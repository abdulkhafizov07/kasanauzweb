import LoadingComponent from '@/components/web/loader'
import { useAuth } from '@/context/auth'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: () => {
    const auth = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      auth.getUserProfile()

      if (
        !auth.isLoading &&
        !auth.isUserLoading &&
        !(auth.user || auth.isAuthenticated)
      ) {
        navigate({
          to: '/auth/login',
          search: { redirect: location.href },
        })
      }
    }, [auth])

    return auth.isLoading || auth.isUserLoading ? (
      <LoadingComponent />
    ) : (
      <Outlet />
    )
  },
})
