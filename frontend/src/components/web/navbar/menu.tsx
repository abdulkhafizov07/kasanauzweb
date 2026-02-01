import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import background from '@/assets/menu/background.png'
import TopBarComponent from '@/components/web/navbar/topbar'
import LogoSvg from '@/assets/logo-white.svg'
import { ClientOnly, Link, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  AlignJustifyIcon,
  BellIcon,
  ChevronRightIcon,
  LogInIcon,
  MailIcon,
  PhoneIcon,
  User2Icon,
  XIcon,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuth } from '@/context/auth'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CategoryType } from '@/types/basic'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import TestDevelopmentComponent from './test'

type MenuCategoryNavProps = {
  id: string
  title: string
  link: string
  clink: string
  source: string
}

function MenuCategoryNav({ title, link, clink, source }: MenuCategoryNavProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['menu', 'category-nav', source],
    queryFn: async (): Promise<CategoryType[]> => {
      const response = await api.get(source + '?page=1&page_size=16')
      if (response.status === 200) {
        return response.data
      }
      throw response
    },
  })

  return (
    <>
      <div className="flex flex-col">
        <Link to={link} className="text-white font-semibold text-lg">
          {title}
        </Link>

        {isLoading ? (
          <Spinner />
        ) : (
          data?.map((item) => (
            <Link
              key={item.guid}
              to={clink}
              params={{
                meta: item.meta,
              }}
              className="text-white/90 hover:text-white transition"
            >
              {item.title}
            </Link>
          ))
        )}
      </div>
    </>
  )
}

export default function MenuComponent() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const auth = useAuth()

  useEffect(() => {
    setOpen(false)
  }, [location])

  if (location.href.includes('auth')) return null

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <AlignJustifyIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="fixed top-0 left-0 max-w-none! w-full h-full p-0 z-100 translate-0 border-none [&>button:first-of-type]:hidden">
          <DialogTitle className="hidden">Menu</DialogTitle>
          <div
            id="menu"
            className="w-full h-full bg-brand bg-center bg-size-[80px] transition-all duration-300"
            style={{ backgroundImage: `url(${background})` }}
          >
            <ClientOnly>
              <TestDevelopmentComponent />
            </ClientOnly>

            <div className="w-full h-full bg-linear-to-br from-[rgba(52,133,114,0.96)] to-[rgba(52,133,114,.861)] text-white">
              <TopBarComponent mode="simple" />

              <div className="container relative mx-auto max-w-[1366px] flex items-center justify-between p-4 border-b border-white/30">
                <Link to="/" className="brand flex relative z-20">
                  <img src={LogoSvg} alt="Logo" className="h-3.5 md:h-5" />
                </Link>

                <div className="actions relative z-10 flex items-center justify-center space-x-2">
                  <div className="hidden md:flex space-x-3">
                    <h4 className="flex items-center space-x-1.5 text-white">
                      <PhoneIcon /> <span>1234</span>
                    </h4>
                    <h4 className="flex items-center space-x-1.5 text-white">
                      <MailIcon /> <span>info@kasana.uz</span>
                    </h4>
                  </div>

                  {!location.pathname.includes('auth') && (
                    <DialogClose asChild>
                      <Button size="icon" className="cursor-pointer">
                        <XIcon />
                      </Button>
                    </DialogClose>
                  )}
                </div>
              </div>

              {/* Menu content */}
              <div className="container hidden md:block mx-auto max-w-[1366px] pt-6 px-4">
                <div className="flex w-full items-start justify-between flex-wrap">
                  <MenuCategoryNav
                    id="shop"
                    title={t('online-shop')}
                    link="/shop"
                    clink="/shop/category/$meta"
                    source={`${import.meta.env.VITE_BACKEND_URL}/news/api/categories/`}
                  />

                  <MenuCategoryNav
                    id="announcements"
                    title={t('announcements')}
                    link="/announcements"
                    clink="/announcements/categories/$meta"
                    source={`${import.meta.env.VITE_BACKEND_URL}/announcements/api/categories/`}
                  />

                  <MenuCategoryNav
                    id="news"
                    title={t('news')}
                    link="/news"
                    clink="/news/categories/$meta"
                    source={`${import.meta.env.VITE_BACKEND_URL}/news/api/categories/`}
                  />

                  <MenuCategoryNav
                    id="courses"
                    title={t('courses')}
                    link="/courses"
                    clink="/news/categories/$meta"
                    source={`${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/categories/`}
                  />
                </div>
              </div>

              <div className="md:hidden w-full flex flex-col items-start justify-start">
                <Link
                  to="/about"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text">Loyiha haqida</span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>
                <Link
                  to="/partners"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text">Hamkorlarimiz</span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>
                <Link
                  to="/"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text">Loyihalar</span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>
                <Link
                  to="/"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text">Kontaktlar</span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>

                <Link
                  to="/profile/notifications"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text flex space-x-2">
                    <span>
                      <BellIcon />
                    </span>
                    <span>Xabarnomalar</span>
                  </span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>
                <Link
                  to="/profile/messenger"
                  className="w-full flex items-center justify-between font-medium border-b border-white/30 p-4"
                >
                  <span className="text flex space-x-2">
                    <span>
                      <MailIcon />
                    </span>
                    <span>Xabarlar</span>
                  </span>
                  <span className="icon">
                    <ChevronRightIcon size={16} />
                  </span>
                </Link>
                <div className="w-full py-4 px-8">
                  {auth.isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link to="/profile/overview">
                        <span className="icon">
                          <User2Icon />
                        </span>
                        <span className="text">Shaxsiy kabinet</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/auth/login">
                        <span className="icon">
                          <LogInIcon />
                        </span>
                        <span className="text">Kirish</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
