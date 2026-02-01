import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from '@tanstack/react-router'
import { UserRole } from '@/types/auth'
import { useAuth } from '@/context/auth'

const AdminRoles: UserRole[] = ['superadmin', 'admin']
const ModeratorRoles: UserRole[] = ['moderator']

export default function UserAccountAction() {
  const { t } = useTranslation()
  const location = useLocation()
  const { isLoading, isAuthenticated, user } = useAuth()

  const getRedirectLink = (): string => {
    if (location.pathname.includes('auth')) return '/'
    if (!isAuthenticated) return '/auth/login/'

    if (user) {
      if (
        AdminRoles.includes(user.role) ||
        ModeratorRoles.includes(user.role)
      ) {
        return '/admin/overview'
      }
      if (user.role === 'user' || user.role === 'housemaker') {
        return '/profile/overview'
      }
    }
    return '/auth/login/'
  }

  const getButtonLabel = (): string => {
    if (location.pathname.includes('auth')) return t('home-page')
    if (!isAuthenticated) return t('login')

    if (user) {
      if (AdminRoles.includes(user.role)) return t('admin-dashboard')
      if (ModeratorRoles.includes(user.role)) return t('moderator-dashboard')
      if (user.role === 'user' || user.role === 'housemaker')
        return t('user-dashboard')
    }
    return t('login')
  }

  return isLoading ? null : (
    <Button
      className="hidden md:flex rounded-full text-brand hover:text-white hover:bg-brand font-semibold"
      variant="ghost"
      asChild
    >
      <Link to={getRedirectLink()}>{getButtonLabel()}</Link>
    </Button>
  )
}
