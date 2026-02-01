import LoadingComponent from '@/components/web/loader'
import { Card, CardContent } from '@/components/ui/card'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AdminAsideComponent } from '@/components/web/admin/aside'
import { AdminNavbarComponent } from '@/components/web/admin/navbar'
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/admin/_adminLayout')({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()
      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(hasOne(permissions, 'admin:read') || auth.user?.role === 'admin')
        ) {
          navigate({ to: '/auth/login' })
        }
      }
    }, [auth.isLoading, auth.isUserLoading, auth.user, navigate])

    // While loading, show loader
    if (auth.isLoading || auth.isUserLoading) {
      return <LoadingComponent />
    }

    return <RouteComponent />
  },
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminAsideComponent />
      <div className="admin-main w-full">
        <AdminNavbarComponent />
        <div className="p-4 bg-gray-100 min-h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
