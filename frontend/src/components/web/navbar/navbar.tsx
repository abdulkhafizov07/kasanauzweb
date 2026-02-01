import { lazy, Suspense, JSX, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LogoSvg from '@/assets/logo.svg'
import {
  MegaphoneIcon,
  NewspaperIcon,
  PlayCircleIcon,
  ShoppingCartIcon,
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

const UserAccountAction = lazy(() => import('./account'))
const SearchComponent = lazy(() => import('./search'))
const MenuComponent = lazy(() => import('./menu'))

type NavLinkProps = {
  link: string
  icon: JSX.Element
  text: string
}

function NavLink({ link, icon, text }: NavLinkProps) {
  return (
    <>
      <Link
        to={link}
        inactiveProps={{
          className: 'text-text hover:bg-brand hover:text-white',
        }}
        activeProps={{
          className: 'bg-brand text-white',
        }}
        className="flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-300"
      >
        {icon}
        <span>{text}</span>
      </Link>
    </>
  )
}

export default function NavbarComponent() {
  const { t } = useTranslation('translation')
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <nav id="navbar">
        <div className="container relative mx-auto max-w-[1366px] p-4">
          <div className="grid grid-cols-4 items-center justify-center h-11">
            {!searchOpen && (
              <Link to="/{-$locale}">
                <img src={LogoSvg} alt="Logo" className="h-6" />
              </Link>
            )}

            {!searchOpen && (
              <div className="col-span-2">
                {!location.pathname.includes('auth') && (
                  <div className="w-full h-full top-0 left-0 z-10 items-center justify-center space-x-2.5 hidden lg:flex">
                    <NavLink
                      link="/shop"
                      icon={<ShoppingCartIcon size={20} />}
                      text={t('online-shop')}
                    />
                    <NavLink
                      link="/announcements"
                      icon={<MegaphoneIcon size={20} />}
                      text={t('announcements')}
                    />
                    <NavLink
                      link="/news"
                      icon={<NewspaperIcon size={20} />}
                      text={t('news')}
                    />
                    <NavLink
                      link="/courses"
                      icon={<PlayCircleIcon size={20} />}
                      text={t('courses')}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <Suspense fallback={<Spinner />}>
                <SearchComponent onOpenChange={setSearchOpen} />
                {!searchOpen && (
                  <>
                    <UserAccountAction />
                    <MenuComponent />
                  </>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
