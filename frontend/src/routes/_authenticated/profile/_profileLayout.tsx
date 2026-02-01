import { lazy, useEffect, useState } from 'react'
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useAuth } from '@/context/auth'
import LoadingComponent from '@/components/web/loader'

const ProfileSideBarComponent = lazy(
  () => import('@/components/web/profile/aside'),
)

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia?.(query).matches ?? false,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)
    setMatches(mediaQuery.matches)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

export const Route = createFileRoute('/_authenticated/profile/_profileLayout')({
  component: () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      auth.getUserProfile()

      if (
        !(auth.isLoading || auth.isUserLoading) &&
        !auth.isAuthenticated &&
        !location.pathname.includes('notifications')
      ) {
        navigate({ to: '/auth/login' })
      }
    }, [auth, location])

    if (auth.isLoading || auth.isUserLoading) {
      return <LoadingComponent />
    }

    return <RouteComponent />
  },
})

function RouteComponent() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="container max-w-[1366px] flex items-start justify-start space-x-4 mx-auto px-4">
      {isDesktop && <ProfileSideBarComponent />}
      <div className="main w-full">
        <Outlet />
      </div>
    </div>
  )
}
