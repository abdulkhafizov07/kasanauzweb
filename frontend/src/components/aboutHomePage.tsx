import CounterWidget from '@/components/ui/counter'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, CircleIcon, CircleSmallIcon } from 'lucide-react'
import { Container } from './ui/container'

export default function AboutHomePageComponent() {
  return (
    <section id="about">
      <Container className="py-12" variant="constrainedBreakpointPadded">
        <div className="flex items-center justify-center flex-col md:flex-row gap-12">
          <div className="images max-w-1/2 select-none">
            <div className="flex items-center justify-center gap-4">
              <div
                className="relative aspect-[2/4.5] h-[318px] rounded-lg overflow-hidden"
                data-aos="zoom-in"
              >
                <img
                  src="/assets/about/1_480.webp"
                  srcSet="/assets/about/1_480.webp 480w, 
          /assets/about/1_720.webp 720w"
                  sizes="(max-width: 480px) 480px, 720px"
                  alt="About Image 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="effect absolute top-0 left-0 w-full h-full bg-linear-to-br from-brand via-transparent to-brand/50 z-10"></div>
              </div>
              <div
                className="relative aspect-2/6 h-[492px] rounded-lg overflow-hidden"
                data-aos="zoom-in"
              >
                <img
                  src="/assets/about/2_480.webp"
                  srcSet="/assets/about/2_480.webp 480w, 
          /assets/about/2_720.webp 720w"
                  sizes="(max-width: 480px) 480px, 720px"
                  alt="About Image 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="effect absolute top-0 left-0 w-full h-full bg-linear-to-br from-transparent via-transparent to-blue-500/50 z-10"></div>
              </div>
              <div className="flex flex-col gap-4" data-aos="zoom-in">
                <div className="relative aspect-square h-[250px] rounded-lg overflow-hidden">
                  <img
                    src="/assets/about/3_480.webp"
                    srcSet="/assets/about/3_480.webp 480w,
          /assets/about/3_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="About Image 3"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="effect absolute flex items-center justify-center flex-col top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-brand  z-10">
                    <h1 className="text-5xl text-white font-bold mb-2 flex items-center justify-center">
                      <CounterWidget num={12255} />
                      <span>+</span>
                    </h1>
                    <p className="text-xl text-white">Kasanachilar</p>
                  </div>
                </div>

                <div className="aspect-3/4 w-[132px] h-[185px] rounded-lg overflow-hidden">
                  <img
                    src="/assets/about/4_480.webp"
                    srcSet="/assets/about/4_480.webp 480w,
          /assets/about/4_720.webp 720w"
                    sizes="(max-width: 480px) 480px, 720px"
                    alt="About Image 4"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="description max-w-1/2">
            <h3
              className="text-text text-3xl font-semibold mb-2"
              data-aos="fade-out-down"
            >
              Kasanachilikni rivojlantirish, bu sohada yangi imkoniyatlar
              yaratish va mahalliy iqtisodiyotga hissa qo'shish uchun muhimdir.
            </h3>
            <p className="text-description mb-4" data-aos="fade-out-down">
              Kasanachilikni rivojlantirish, bu sohada yangi imkoniyatlar
              yaratish va mahalliy iqtisodiyotga hissa qo'shish uchun muhimdir.
              Kasanachilikni rivojlantirish orqali, biz an'anaviy
              hunarmandchilikni zamonaviy texnologiyalar bilan birlashtirib,
              yangi mahsulotlar va xizmatlar taklif etishimiz mumkin.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="card flex gap-2" data-aos="zoom-in">
                <div className="card-icon h-full pt-1 text-brand">
                  <span className="relative flex items-center justify-center w-6 h-6">
                    <CircleIcon className="stroke-2.5" size={24} />
                    <CircleSmallIcon className="absolute stroke-3" size={14} />
                  </span>
                </div>
                <div className="card-body">
                  <h3 className="text-xl text-text font-semibold mb-1">
                    Kasanachi
                  </h3>
                  <p className="text-description">
                    Kasanachilikni rivojlantirish, bu sohada yangi imkoniyatlar
                    yaratish va mahalliy iqtisodiyotga hissa qo'shish uchun
                    muhimdir.
                  </p>
                </div>
              </div>

              <div className="card flex gap-2" data-aos="zoom-in">
                <div className="card-icon h-full pt-1 text-brand">
                  <span className="relative flex items-center justify-center w-6 h-6">
                    <CircleIcon className="stroke-2.5" size={24} />
                    <CircleSmallIcon className="absolute stroke-3" size={14} />
                  </span>
                </div>
                <div className="card-body">
                  <h3 className="text-xl text-text font-semibold mb-1">
                    Kasanachi
                  </h3>
                  <p className="text-description">
                    Kasanachilikni rivojlantirish, bu sohada yangi imkoniyatlar
                    yaratish va mahalliy iqtisodiyotga hissa qo'shish uchun
                    muhimdir.
                  </p>
                </div>
              </div>
            </div>

            <Button asChild size={'lg'}>
              <Link to="/about">
                <span className="text">Loyiha haqida</span>
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
