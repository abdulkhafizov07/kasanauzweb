import { Link } from '@tanstack/react-router'
import {
  BellIcon,
  BookHeartIcon,
  BookUserIcon,
  BoxesIcon,
  MailIcon,
  MegaphoneIcon,
  StarIcon,
  StoreIcon,
  UserIcon,
  LogOutIcon,
} from 'lucide-react'
import { useAuth } from '@/context/auth'

const PROFILE_SIDEBAR_LINKS = [
  {
    text: 'Shaxsiy ma’lumotlarim',
    icon: <UserIcon />,
    lead: '/profile/overview',
  },
  {
    text: 'Mahsulotlarim',
    icon: <StoreIcon />,
    lead: '/profile/products',
  },
  {
    text: 'Yoqqan mahsulotlar',
    icon: <BoxesIcon />,
    lead: '/profile/liked-products',
  },
  {
    text: 'E’lonlarim',
    icon: <MegaphoneIcon />,
    lead: '/profile/announcements',
  },
  {
    text: 'Saqlangan e’lonlar',
    icon: <StarIcon />,
    lead: '/profile/saved-announcements',
  },
  {
    text: 'Kurslarim',
    icon: <BookUserIcon />,
    lead: '/profile/courses',
  },
  {
    text: 'Yoqqan kurslar',
    icon: <BookHeartIcon />,
    lead: '/profile/liked-courses',
  },
  {
    text: 'Xabarlar',
    icon: <MailIcon />,
    lead: '/profile/messenger',
  },
  {
    text: 'Xabarnomalar',
    icon: <BellIcon />,
    lead: '/profile/notifications',
  },
]

export default function ProfileSideBarComponent() {
  return (
    <>
      <div className="min-w-max min-h-[calc(100vh-170px)] flex flex-col space-y-2 mb-4">
        {PROFILE_SIDEBAR_LINKS.map((item, index) => (
          <Link
            to={item.lead}
            className="max-w-min md:min-w-max flex items-center justify-start md:space-x-2 py-1.5 px-3 rounded-lg transition duration-200 ease-in"
            inactiveProps={{
              className: 'text-black hover:text-white hover:bg-brand',
            }}
            activeProps={{
              className: 'text-white bg-brand',
            }}
            key={index}
          >
            <span className="icon">{item.icon}</span>
            <span className="text hidden md:inline">{item.text}</span>
          </Link>
        ))}
        <Link
          to="/auth/logout"
          className="flex items-center justify-start space-x-2 py-1.5 px-3 rounded-lg transition duration-200 ease-in"
          inactiveProps={{
            className: 'text-red-400 hover:text-white hover:bg-red-400',
          }}
          activeProps={{
            className: 'text-white bg-brand',
          }}
        >
          <span className="icon">
            <LogOutIcon />
          </span>
          <span className="text hidden md:inline">Chiqish</span>
        </Link>
      </div>
    </>
  )
}
