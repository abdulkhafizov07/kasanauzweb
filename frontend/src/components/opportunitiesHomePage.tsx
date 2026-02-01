import { useState } from 'react'

import CounterWidget from '@/components/ui/counter'
import {
  BoxIcon,
  BriefcaseIcon,
  CompassIcon,
  PlayCircleIcon,
} from 'lucide-react'
import { Container } from './ui/container'

export default function OpportunitiesHomePageComponent() {
  const [opportunities] = useState([
    {
      icon: <BoxIcon />,
      title: 'Mahsulotlarni sotish va sotib olish',
      description: `Mahsulotlarni ko’rish va sotib olish jarayoni juda qulay.
                    Siz turli xil mahsulotlarni ko’rib chiqib, kerakli
                    narsalarni osongina tanlashingiz mumkin.`,
    },
    {
      icon: <BriefcaseIcon />,
      title: 'Ish boyicha e’lonlarni berish va kuzatib borish',
      description:
        "Ish e’lonlarini berish va kuzatish jarayonini kengaytirish, ishga qabul qilishni yaxshilash va ish beruvchilar bilan ish izlovchilar o'rtasida aloqani o'rnatish muhimdir.",
    },
    {
      icon: <CompassIcon />,
      title: 'Sohada mavjud eng so’nggi yangiliklar',
      description:
        "Sohada mavjud yangiliklar haqida qisqacha ma'lumot beramiz. Bu yangiliklar sizning qiziqishingizni oshirishi mumkin.",
    },
    {
      icon: <PlayCircleIcon />,
      title: 'Juda katta kurslar bazasi',
      description:
        'Juda katta kurslar bazasi, ahol különböző tantárgyakat és témákat tanulmányozhatunk, hogy fejlesszük tudásunkat és készségeinket.',
    },
  ])

  return (
    <section id="opportunities" className="overflow-hidden">
      <Container className="py-12" variant="constrainedBreakpointPadded">
        <div className="flex items-start justify-center flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-4">
              <span className="text-brand">Kasana.UZ</span> dagi <br />
              imkoniyatlaringiz
            </h1>

            <div className="flex flex-col items-start justify-start space-y-3">
              {opportunities.map((value, index) => (
                <div
                  className="flex items-start justify-center space-x-2"
                  key={index}
                  data-aos="fade-right"
                >
                  <span className="icon min-w-8 pl-2">{value.icon}</span>
                  <div className="text">
                    <h3 className="font-medium mb-1">{value.title}</h3>
                    <p className="text-description text-sm">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-3/5">
                <div
                  className="relative card aspect-9/6 bg-brand rounded-lg overflow-hidden border border-brand"
                  data-aos="zoom-in"
                >
                  <img
                    src="/assets/home/home11_480.webp"
                    srcSet="/assets/home/home11_480.webp 480w,
          /assets/home/home11_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="Home Image 11"
                    className="w-15 absolute -right-2 -bottom-2"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="flex flex-col w-full h-full justify-between p-3">
                    <h3 className="text-white">Kasanachilar soni</h3>

                    <h2 className="text-2xl flex items-center text-white font-semibold">
                      <CounterWidget num={12250} />
                      <span>+</span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className="w-2/5">
                <div
                  className="relative card aspect-square bg-bg-placeholder rounded-lg overflow-hidden border border-border"
                  data-aos="fade-left"
                >
                  <img
                    src="/assets/home/home12_480.webp"
                    srcSet="/assets/home/home12_480.webp 480w,
          /assets/home/home12_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="Home Image 12"
                    className="w-15 absolute -right-2 -bottom-2"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="flex flex-col w-full h-full justify-between p-3">
                    <h3 className="text-brand">Sohalar soni</h3>

                    <h2 className="text-2xl flex items-center text-brand font-semibold">
                      <CounterWidget num={120} />
                      <span>+</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2/5">
                <div
                  className="relative card aspect-square bg-bg-placeholder rounded-lg overflow-hidden border border-border"
                  data-aos="zoom-in"
                >
                  <img
                    src="/assets/home/home13_480.webp"
                    srcSet="/assets/home/home13_480.webp 480w,
          /assets/home/home13_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="Home Image 13"
                    className="w-15 absolute -right-2 bottom-0"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="flex flex-col w-full h-full justify-between p-3">
                    <h3 className="text-brand">Mahsulot turlari</h3>

                    <h2 className="text-2xl flex items-center text-brand font-semibold">
                      <CounterWidget num={8500} />
                      <span>+</span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className="w-3/5">
                <div
                  className="relative card aspect-9/6 bg-bg-placeholder rounded-lg overflow-hidden border border-border"
                  data-aos="fade-left"
                >
                  <img
                    src="/assets/home/home14_480.webp"
                    srcSet="/assets/home/home14_480.webp 480w,
          /assets/home/home14_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="Home Image 14"
                    className="w-15 absolute -right-2 bottom-0"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="flex flex-col w-full h-full justify-between p-3">
                    <h3 className="text-brand">
                      Kasanachilarning o’rtacha oylik daromadi
                    </h3>

                    <h2 className="text-2xl flex items-center text-brand font-semibold">
                      <CounterWidget num={8000000} />
                      <span>+</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
