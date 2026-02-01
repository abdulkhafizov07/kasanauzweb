import { ClientOnly, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import TestDevelopmentComponent from './web/navbar/test'
import NavbarComponent from './web/navbar/navbar'
import TopBarComponent from './web/navbar/topbar'

export default function Header() {
  const [scrollMoved, setScrollMoved] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkScrollUpdate = () => {
      if (window.scrollY > 40) {
        setScrollMoved(true)
      } else {
        setScrollMoved(false)
      }
    }

    checkScrollUpdate()

    window.addEventListener('scroll', checkScrollUpdate)

    return () => {
      window.removeEventListener('scroll', checkScrollUpdate)
    }
  }, [])

  if (location.pathname.includes('admin')) return null

  return (
    <>
      <header
        className={
          (location.href === '/' ? 'fixed' : 'sticky') +
          ' top-0 left-0 w-full h-auto z-99 transition-colors duration-200 ease-in ' +
          (scrollMoved || location.href !== '/'
            ? 'bg-white/85 backdrop-blur-3xl'
            : 'bg-white/15 backdrop-blur-md')
        }
      >
        <ClientOnly>
          <TestDevelopmentComponent />
        </ClientOnly>
        <TopBarComponent mode="normal" />
        <NavbarComponent />
      </header>
    </>
  )
}
