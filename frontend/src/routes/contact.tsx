import { createFileRoute } from '@tanstack/react-router'
import backgroundImage1 from '@/pages/static/contacts/backgroundImage1.jpg'
import backgroundImage2 from '@/pages/static/contacts/backgroundImage2.png'
import posterImage2 from '@/pages/OnlineShopPages/HomePage/posterImg2.png'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section id="contacts">
      {/* Top Section with Form */}
      <div
        className="relative px-5 md:px-12 py-12 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage1})` }}
      >
        <div className="absolute inset-0 bg-[#41a584e7] z-0"></div>

        <h1 className="relative z-10 text-center text-white font-semibold w-full md:w-2/5 mx-auto">
          Loyiha faoliyati bo'yicha savollar yoki takliflar uchun oynani
          to'ldiring.
        </h1>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 mt-10 max-w-[1366px] mx-auto">
          {/* Left Contact Info */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            {/* Phone */}
            <div className="flex gap-3 items-start">
              <svg
                className="w-10 h-10"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="white" />
                <path
                  d="M33.9975 28.92V31.92..."
                  stroke="#41A58D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col gap-1 text-white">
                <p className="text-sm">Telefon raqami</p>
                <a href="tel:+998953988198" className="hover:opacity-60">
                  +998 95 398 81 98
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3 items-start">
              <svg
                className="w-10 h-10"
                viewBox="0 0 48 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="4" width="48" height="48" rx="24" fill="white" />
                <path
                  d="M34 22C34 20.9..."
                  stroke="#41A58D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col gap-1 text-white">
                <p className="text-sm">Elektron pochta</p>
                <a href="mailto:info@kasana.uz" className="hover:opacity-60">
                  info@kasana.uz
                </a>
                <a href="mailto:support@kasana.uz" className="hover:opacity-60">
                  support@kasana.uz
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-3 items-start">
              <svg
                className="w-10 h-10"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="white" />
                <path
                  d="M15 23L34 14L25 33..."
                  stroke="#41A58D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col gap-1 text-white">
                <p className="text-sm">Manzil</p>
                <p>100066, Toshkent shahar, Islom Karimov ko'chasi, 45</p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 bg-white rounded-lg p-6 shadow">
            <form className="flex flex-col gap-4">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full border-b border-gray-500 focus:outline-none py-2 px-1"
                />
                <label
                  htmlFor="name"
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"
                >
                  Ism va familiya
                </label>
              </div>

              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full border-b border-gray-500 focus:outline-none py-2 px-1"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"
                >
                  Telefon raqami
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full border-b border-gray-500 focus:outline-none p-2 resize-none h-40"
                />
                <label
                  htmlFor="message"
                  className="absolute left-1 top-4 text-gray-500 text-sm pointer-events-none"
                >
                  Xabaringizni kiriting
                </label>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#41a58d] text-white rounded-md py-2 mt-3 hover:opacity-80 transition"
              >
                Yuborish
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M4.16406 10H15.8307..."
                    stroke="white"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Poster Section */}
      <div className="relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url(${backgroundImage2})` }}
        ></div>

        <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 px-5 md:px-12 py-12 max-w-[1366px] mx-auto">
          <div className="w-full md:w-3/5">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-black text-2xl md:text-3xl w-1/2">
                Ipakchilikdagi muvaffaqiyatli tajriba
              </p>
              <div className="hidden md:flex flex-col items-end">
                <div className="bg-[#77f9da4d] px-4 py-2 rounded-xl border border-white/20">
                  Mubina Ismatjonova
                </div>
                <div className="bg-gray-200/30 px-4 py-2 rounded-xl border mt-2 text-sm">
                  Kasanachi, ipakchi
                </div>
              </div>
            </div>
            <p className="mt-4 text-black md:w-3/4">
              Ipakchilikdagi muvaffaqiyatli tajriba, bu sohada amalga oshirilgan
              innovatsion yondashuvlar va zamonaviy texnologiyalar yordamida
              erishilgan natijalar haqida.
            </p>
          </div>

          <div className="relative w-full md:w-2/5 flex justify-center">
            <div className="absolute w-52 h-52 md:w-64 md:h-64 bg-yellow-500 rounded-full"></div>
            <img
              src={posterImage2}
              alt="poster"
              className="relative z-10 w-40 md:w-64 mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
