import TheHistoryOfSuccess1 from '@/assets/courses/thehistoryofsuccess1.png'
import TheHistoryOfSuccess2 from '@/assets/courses/thehistoryofsuccess2.jpg'

export default function TheHistoryOfSuccess() {
  return (
    <>
      <div className="the-history-of-success my-12">
        <div className="container mx-auto max-w-[1366px] px-4">
          <div className="head">
            <h3 className="title text-3xl font-bold">
              Bir muvaffaqiyat tarixi
            </h3>
            <p className="subtitle text-[16px] font-normal text-description">
              Mashhur hunarmand va kasanachilar hikoyasi
            </p>
          </div>

          <div className="content grid grid-cols-2 gap-x-4 mt-4">
            <div
              className="card relative group overflow-hidden rounded-lg"
              data-aos="zoom-in"
            >
              <div className="card-image aspect-12/9 w-full flex items-center justify-center bg-brand">
                <img
                  src={TheHistoryOfSuccess1}
                  alt="..."
                  className="object-cover h-full group-hover:scale-115 transition-all duration-300 ease-in"
                />
              </div>
              <div className="card-body absolute w-full h-full top-0 left-0 flex items-end justify-start bg-linear-to-b from-white/5 from-35% to-black/36">
                <div className="content w-full p-4">
                  <h3 className="title text-3xl text-white font-semibold">
                    O‘zini o‘zi band qilgan shaxslar
                  </h3>
                  <p className="description text-white">
                    «Kasanachilikni yanada rivojlantirishga oid qo‘shimcha
                    chora-tadbirlar to‘g‘risida»gi
                  </p>
                </div>
              </div>
            </div>
            <div
              className="card relative group overflow-hidden rounded-lg"
              data-aos="zoom-in"
            >
              <div className="card-image aspect-12/9 w-full flex items-center justify-center bg-brand">
                <img
                  src={TheHistoryOfSuccess2}
                  alt="..."
                  className="object-cover h-full group-hover:scale-115 transition-all duration-300 ease-in"
                />
              </div>
              <div className="card-body absolute w-full h-full top-0 left-0 flex items-end justify-start bg-linear-to-b from-white/5 from-35% to-black/75">
                <div className="content w-full p-4">
                  <h3 className="title text-3xl text-white font-semibold">
                    O‘zini o‘zi band qilgan shaxslar
                  </h3>
                  <p className="description text-white">
                    «Kasanachilikni yanada rivojlantirishga oid qo‘shimcha
                    chora-tadbirlar to‘g‘risida»gi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
