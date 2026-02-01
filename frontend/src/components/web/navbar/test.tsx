import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from '@/components/ui/shadcn-io/marquee'
import { useTranslation } from 'react-i18next'

export default function TestDevelopmentComponent() {
  const { t } = useTranslation()

  return (
    <>
      <div className="w-full bg-brand py-1 px-1 text-white">
        <Marquee>
          <MarqueeContent autoFill={false}>
            <MarqueeItem>{t('betaNotice')}</MarqueeItem>
          </MarqueeContent>
        </Marquee>
      </div>
    </>
  )
}
