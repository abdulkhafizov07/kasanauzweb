import { BreadcrumbGenerator } from '@/utils/breadcrumb'
import { createFileRoute } from '@tanstack/react-router'
import { HomeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/shop/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  return (
    <>
      <section id="categories">
        <div className="navigation bg-brand">
          <div className="container mx-auto max-w-[1366px] py-3 px-4">
            <BreadcrumbGenerator
              elements={[
                { link: '/', children: <HomeIcon size={18} /> },
                { link: '/shop', children: t('online-shop') },
                'Barcha categoriyalar',
              ]}
            />
          </div>
        </div>
        <div className="titlebar h-26 bg-white">
          <div className="container mx-auto max-w-[1366px] mt-6 px-4">
            <h1 className="text-2xl text-brand font-semibold">
              Barcha mahsulotlar
            </h1>
          </div>
        </div>
      </section>
    </>
  )
}
