import { JSX, lazy } from 'react'
import { Link, useLocation } from '@tanstack/react-router'

import backgroundImg from './web/backgroundImg.png'
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react'

interface SocialLink {
  icon: JSX.Element
  link: string
}

const SocialLinks: SocialLink[] = [
  { icon: <FacebookIcon />, link: 'https://facebook.com' },
  { icon: <InstagramIcon />, link: 'https://instagram.com' },
  { icon: <TwitterIcon />, link: 'https://x.com' },
  { icon: <FacebookIcon />, link: 'https://t.me' },
]

export default function Footer() {
  const location = useLocation()

  if (location.pathname.includes('admin')) return null

  return (
    <div
      id="footer"
      className="relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-l from-[#f0f2f1f1] to-[#f0f2f1f1] z-10" />

      <div className="relative z-20 max-w-[1366px] mx-auto flex flex-wrap justify-between py-9 px-4 md:px-6">
        {/* logo + contact */}
        <div className="mb-6">
          <div className="text-[22px] font-semibold">
            <Link to="/" className="text-black">
              Kasana.UZ
            </Link>
          </div>
          <div className="my-2 text-[26px] font-semibold">
            <a href="https://t.me/elwnc_bot" className="text-[#41A58D]">
              @telegram_bot
            </a>
          </div>
          <div>
            <a href="mailto:info@kasana.uz" className="text-[#757575]">
              info@kasana.uz
            </a>
          </div>
          <div className="mt-2 text-[#41A58D]">
            Toshkent shahri, Ahmad Donish, 1A
          </div>
          <div className="mt-1 text-sm text-[#757575]">
            Мы работаем с 08:00 до 20:00
          </div>
          <div className="mt-5 flex justify-between w-[300px] text-xs text-[#757575]">
            <span>© 2021 “Kasana.UZ” MCHJ</span>
            <Link to="/" hash="privacy">
              Maxfiylik siyosati
            </Link>
          </div>
        </div>

        {/* section: Loyiha */}
        <div className="mb-6 hidden sm:block">
          <ul>
            <li className="font-semibold text-lg">Loyiha</li>
            <li className="mt-4">
              <Link to="/about" className="text-[#757575] hover:text-black">
                Kompaniya haqida
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/news" className="text-[#757575] hover:text-black">
                Yangiliklar
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/partners" className="text-[#757575] hover:text-black">
                Hamkorlik
              </Link>
            </li>
          </ul>
        </div>

        {/* section: Yo'nalishlar */}
        <div className="mb-6 hidden sm:block">
          <ul>
            <li className="font-semibold text-lg">Yo'nalishlar</li>
            <li className="mt-4">
              <Link
                to="/announcements/work"
                className="text-[#757575] hover:text-black"
              >
                Ish e'lonlari
              </Link>
            </li>
            <li className="mt-4">
              <Link
                to="/announcements/service"
                className="text-[#757575] hover:text-black"
              >
                Kasanachi topish
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/courses" className="text-[#757575] hover:text-black">
                Kurslar
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/news" className="text-[#757575] hover:text-black">
                Yangiliklar
              </Link>
            </li>
          </ul>
        </div>

        {/* section: Ma'lumotlar */}
        <div className="mb-6 hidden sm:block">
          <ul>
            <li className="font-semibold text-lg">Ma'lumotlar</li>
            <li className="mt-4">
              <Link to="/partners" className="text-[#757575] hover:text-black">
                Bizning hamkorlar
              </Link>
            </li>
            <li className="mt-4">
              <Link
                to="/"
                hash="faq"
                className="text-[#757575] hover:text-black"
              >
                Tez so'raladigan savollar
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/profile" className="text-[#757575] hover:text-black">
                Shaxsiy kabinet
              </Link>
            </li>
            <li className="mt-4">
              <Link to="/contact" className="text-[#757575] hover:text-black">
                Biz bilan aloqa
              </Link>
            </li>
          </ul>
        </div>

        {/* socials */}
        <div className="w-full sm:w-auto">
          <ul className="flex justify-center sm:justify-start gap-2">
            {SocialLinks.map((socialLink, idx) => (
              <li key={idx}>
                <a
                  href={socialLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex p-2 bg-white rounded-md border-2 border-transparent hover:bg-transparent hover:border-white transition-colors duration-150 ease-in"
                >
                  {socialLink.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
