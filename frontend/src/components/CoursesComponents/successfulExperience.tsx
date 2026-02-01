import { FC, useEffect, useRef, useState } from "react";

const SuccessfulExperience: FC = () => {
  const [sideHeight, setSideHeight] = useState<number>(0);
  const leftSide = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftSide.current) {
      setSideHeight(leftSide.current.clientHeight);
    }
  }, []);

  return (
    <div className="successful-experience my-8 bg-brand overflow-hidden">
      <div className="container mx-auto max-w-[1366px] flex items-center gap-x-8 p-0">
        <div className="side w-1/2 max-h-min" ref={leftSide}>
          <div className="content my-10">
            <h3 className="title text-4xl text-white font-bold w-1/2 mb-2">
              Ipakchilikdagi muvaffaqiyatli tajriba
            </h3>
            <p className="subtitle text-[16px] text-white font-medium w-4/5">
              Ipakchilikdagi muvaffaqiyatli tajriba, bu sohada amalga oshirilgan
              innovatsion yondashuvlar va zamonaviy texnologiyalar yordamida
              erishilgan natijalar haqida.
            </p>
          </div>
        </div>

        <div className="side w-1/2" style={{ height: `${sideHeight}px` }}>
          <div className="content flex h-full justify-between">
            <div className="text min-w-fit max-w-fit flex items-center">
              <div className="inner">
                <div className="gradient-border p-px bg-linear-to-br from-white/30 via-brand to-white/40 rounded-2xl mb-1">
                  <h3 className="styled-title bg-lbrand px-4 py-2 rounded-2xl">
                    <span className="text-xl font-medium text-white">
                      Mubina Ismatjonova
                    </span>
                  </h3>
                </div>

                <div className="gradient-border p-px bg-linear-to-tr from-white/30 via-brand to-white/40 rounded-full max-w-fit float-end">
                  <p className="styled-subtitle bg-[#53A893] py-1.5 px-3 rounded-full">
                    <span className="text-[16px] font-medium text-white">
                      Kasanachi, ipakchi
                    </span>
                  </p>
                </div>
                <span className="normalizer block opacity-0 py-3 px-4">
                  EXAMPLE
                </span>
              </div>
            </div>

            <div className="relative graphics w-full h-full flex items-center justify-center">
              <img
                src="/src/assets/courses/mubina-ismatova.png"
                alt="Mubina Ismatjonova"
                className="absolute h-[418px] -top-4 z-10"
              />

              <div className="figures relative z-5 w-full h-full flex items-center justify-center">
                <div className="absolute left-1/2 -top-8 w-[215px] h-[215px] big-transparent backdrop-blur-lg bg-transparent border border-white/10 rounded-full"></div>
                <div className="w-[253px] h-[253px] big-yellow bg-yellow-pro rounded-full"></div>
                <div className="absolute left-0 -bottom-8 w-[182px] h-[182px] big-transparent backdrop-blur-lg bg-transparent border border-white/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulExperience;
