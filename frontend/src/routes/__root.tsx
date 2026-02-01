import {
  ClientOnly,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import Header from '../components/Header'

import appCss from '../styles.css?url'

import { useEffect } from 'react'
import Footer from '@/components/Footer'
import { RouterContext } from '@/types/router'
import { AuthProvider } from '@/context/auth'
import { AlertDialogProvider } from '@/components/ui/alert-provider'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kasana.UZ',
      },
      {
        name: 'description',
        content:
          'Kasanachilikni rivojlantirish mahalliy iqtisodiyotga turtki beradi, yangi imkoniyatlar yaratadi va an’anaviy hunarmandchilikni zamonaviy texnologiyalar bilan uyg‘unlashtiradi.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css',
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleLoad = () => {
      const mainLoader = document.getElementById('main-loader')

      if (mainLoader) {
        setTimeout(() => {
          mainLoader.style.opacity = '0'
          mainLoader.style.visibility = 'hidden'
          document.body.style.overflow = 'auto'
        }, 400)
      }
    }

    // If the page is already loaded, run immediately
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      // Otherwise, wait for the load event
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>
          {`
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
}
.loader::before,
.loader::after {
  content:"";
  grid-area: 1/1;
  --c:no-repeat radial-gradient(farthest-side,#25b09b 92%,#0000);
  background: 
    var(--c) 50%  0, 
    var(--c) 50%  100%, 
    var(--c) 100% 50%, 
    var(--c) 0    50%;
  background-size: 12px 12px;
  animation: l12 1s infinite;
}
.loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 8px 8px;
  animation-timing-function: linear;
}
@keyframes l12 { 100% { transform: rotate(.5turn); } }
#main-loader {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  background-color: white;
  transition: all 0.9s;
  z-index: 9999;
}
#main-loader h3 {
  font-size: 24px;
  font-family: sans-serif;
  font-weight: bold;
}
#main-loader h3 span {
  font-family: sans-serif;
  color: #25b09b;
}
`}
        </style>
      </head>
      <body style={{ overflow: 'hidden' }}>
        <div id="main-loader">
          <div className="loader"></div>
          <h3>
            <span>Kasana.UZ</span> platformasi yuklanmoqda˚
          </h3>
        </div>

        <ClientOnly>
          <AuthProvider>
            <AlertDialogProvider>
              <Header />
              {children}
              <Footer />
            </AlertDialogProvider>
          </AuthProvider>
        </ClientOnly>

        <Scripts />
      </body>
    </html>
  )
}
