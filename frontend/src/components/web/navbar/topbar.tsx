import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { BellIcon, MailIcon } from 'lucide-react'

export default function TopBarComponent({
  mode,
}: {
  mode: 'simple' | 'normal'
}) {
  const { t } = useTranslation()

  return (
    <div
      className={`container hidden mx-auto max-w-[1366px] md:flex items-center justify-between py-2 px-4 border-b ${
        mode === 'simple' ? 'border-white/30' : 'border-[#D9D9D9]'
      }`}
      data-aos="zoom-out-down"
    >
      <div className="links flex items-center justify-center space-x-3">
        <Link
          to="/"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          {t('home-page')}
        </Link>

        <Link
          to="/about"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          {t('about-project')}
        </Link>

        <Link
          to="/partners"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          {t('partners')}
        </Link>

        <Link
          to="/contact"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          {t('contact')}
        </Link>
      </div>

      <div className="actions flex items-center justify-center space-x-2">
        <Link
          to="/profile/notifications"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          <BellIcon />
        </Link>

        <Link
          to="/profile/messenger"
          inactiveProps={{
            className: `${
              mode === 'normal' ? 'text-text' : 'text-white/70'
            } font-normal transition-all duration-300`,
          }}
          activeProps={{
            className: `${
              mode === 'normal' ? 'text-brand' : 'text-white'
            } font-semibold transition-all duration-300`,
          }}
        >
          <MailIcon />
        </Link>
      </div>
    </div>
  )
}
