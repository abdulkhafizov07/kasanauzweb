import { createFileRoute } from "@tanstack/react-router";
import backgroundImg from "@/pages/OnlineShopPages/HomePage/backgroundImg.png";
import img from "@/pages/OnlineShopPages/HomePage/posterImg.png";
import posterImage2 from "@/pages/OnlineShopPages/HomePage/posterImg2.png";
import partnerImage1 from "@/pages/static/partners/1.jpeg";
import partnerImage2 from "@/pages/static/partners/2.jpeg";
import partnerImage3 from "@/pages/static/partners/3.png";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/partners")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section id="partners">
      {/* Mini Poster */}
      <div
        className="relative flex h-[250px] w-full justify-between overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="absolute inset-0 bg-[#41a584e7]" />
        <div className="relative z-10 flex h-full w-2/5 items-center justify-center text-[28px] font-semibold text-white">
          Xalqaro hamkorlar
        </div>
        <img
          src={img}
          alt=""
          className="relative z-10 h-[380px] w-3/5 object-cover"
        />
      </div>

      {/* Text */}
      <div className="mx-auto mt-12 w-1/3 text-center text-gray-500 max-md:w-2/3 max-sm:w-4/5">
        Loyiha bir qator xalqaro tashkilotlar, muassasalar va fondlar bilan
        muvaffaqiyatli aloqalarga ega.
      </div>

      {/* Partners grid */}
      <div className="mx-auto my-16 flex max-w-[1366px] items-center justify-center flex-wrap gap-16">
        <Link to="." className="flex justify-center">
          <img
            src={partnerImage1}
            alt=""
            className="mx-auto block w-[320px] object-cover"
          />
        </Link>
        <Link to="." className="flex justify-center">
          <img
            src={partnerImage2}
            alt=""
            className="mx-auto block w-[250px] object-cover"
          />
        </Link>
        <Link to="." className="flex justify-center">
          <img
            src={partnerImage3}
            alt=""
            className="mx-auto block w-[250px] object-cover"
          />
        </Link>
      </div>

      {/* Poster */}
      <div className="bg-[#41a58d]">
        <div className="mx-auto flex h-[350px] max-w-[1366px] items-center justify-center overflow-hidden px-[50px] max-md:h-[500px] max-md:flex-col max-md:px-5">
          {/* Left side */}
          <div className="ml-auto w-3/5 max-md:m-0 max-md:w-full">
            <div className="flex items-center justify-between max-md:flex-col">
              <p className="w-1/2 text-[28px] font-semibold text-white max-md:w-full max-md:text-center max-md:text-[22px]">
                Ipakchilikdagi muvaffaqiyatli tajriba
              </p>
              <div className="flex flex-col items-end max-md:hidden">
                <div className="rounded-[15px] border border-white/20 bg-[#77f9da4d] px-4 py-3 text-white">
                  Mubina Ismatjonova
                </div>
                <div className="mt-2 rounded-[20px] border border-white/10 bg-[#b7b7b726] px-4 py-2 text-[15px] text-white">
                  Kasanachi, ipakchi
                </div>
              </div>
            </div>
            <div className="mt-2 w-3/4 text-white max-md:mt-3 max-md:w-full max-md:text-center">
              Ipakchilikdagi muvaffaqiyatli tajriba, bu sohada amalga oshirilgan
              innovatsion yondashuvlar va zamonaviy texnologiyalar yordamida
              erishilgan natijalar haqida.
            </div>
          </div>

          {/* Right side */}
          <div className="relative w-2/5 pl-20 max-md:mb-[-60px] max-md:w-full max-md:pl-0">
            <div className="absolute top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-[#e8b931] max-md:left-1/2 max-md:h-[200px] max-md:w-[200px] max-md:-translate-x-1/2">
              <div className="absolute bottom-0 left-[-30px] h-[150px] w-[150px] rounded-full border border-white/20 bg-[#b7b7b726] backdrop-blur-sm" />
              <div className="absolute right-[-70px] top-[-30px] h-[190px] w-[190px] rounded-full border border-white/20 bg-[#77f9da4d] backdrop-blur-sm max-md:h-[170px] max-md:w-[170px]" />
            </div>
            <img
              src={posterImage2}
              alt=""
              className="relative z-10 top-[50px] w-[260px] max-md:left-1/2 max-md:w-[190px] max-md:-translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
