import backgroundImg from '@/pages/OnlineShopPages/HomePage/backgroundImg.png'
import img from '@/pages/OnlineShopPages/HomePage/posterImg.png'
import '@/pages/static/about-project/aboutProject.scss'
import q from '@/assets/news/“.png'
import posterImage2 from '@/pages/OnlineShopPages/HomePage/posterImg2.png'

import { createFileRoute } from '@tanstack/react-router'

function About() {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
  }

  return (
    <>
      <section id="aboutProject">
        <div className="miniPoster" style={backgroundStyle}>
          <div className="text">Loyiha haqida</div>
          <img src={img} alt="" />
        </div>
        <div className="about-hero">
          <h1 className="hero-title title">
            Kutmang. Bizning hayotimizning maqsadi baxtli bo'lishdir!
          </h1>
          <p className="simpleText">
            Kelib yetganingizda, xonada tabiiy yog'ochni tozalash uchun
            ishlatiladigan limon balzamining yoqimli hididan zavqlanasiz, bu esa
            muhitni tinchlantiruvchi atmosferaga aylantiradi. Mening butun
            ruhimni ajoyib tinchlik egallab oldi, bahorning shirin tonglari
            kabi, men buni butun qalbim bilan bahramand bo'laman. Men yolg'izman
            va bu joyda mavjudlikning jozibasini his qilaman, bu joy mening kabi
            ruhlar uchun baxt uchun yaratilgan. Men juda baxtliman, aziz
            do'stim, noziklikka to'la.
          </p>
          <div className="other-text">
            <img src={q} alt="" />
            <h2>
              O‘zini o‘zi band qilgan shaxslar, o‘z maqsadlariga erishish uchun
              turli xil faoliyatlar
            </h2>
            <p>
              Hayajoningizni qondirishga tayyor bo'lganda, kurortning suv
              sportlari markazida mavjud bo'lgan suv sportlari imkoniyatlarini
              ko'rib chiqing. Stressingizni suvda qoldirmoqchimisiz? Kurortda
              kayaklar, paddleboardlar yoki tinch pedal qayiqchalari mavjud.
            </p>
          </div>
          <h1 className="title">
            Qancha vaqt emas, balki qanday yashaganingiz asosiy narsadir.
          </h1>
          <p className="simpleText">
            Hayajoningizni qondirishga tayyor bo'lganda, kurortning suv
            sportlari markazida mavjud bo'lgan suv sportlari imkoniyatlarini
            ko'rib chiqing. Stressingizni suvda qoldirmoqchimisiz? Kurortda
            kayaklar, paddleboardlar yoki tinch pedal qayiqchalari mavjud.
            Shuningdek, siz doimiy o'zgarib turadigan dengiz osti muhitini
            tajribadan o'tkazishingiz uchun snorkel uskunalari ham mavjud.
            Yotoqxonalarga tashrif buyuruvchilar, tashrif buyurayotgan joylari
            haqida noyob nuqtai nazar olish bilan birga, boshqa mehmonxona
            sharoitlarida mavjud bo'lmagan maxsus paketlar uchun variantlarga
            ega. Yotoqxonalarning mahalliy bizneslar bilan hamkorlik qilishlari
            oson, bu esa yaxshi tashkil etilgan va shaxsiylashtirilgan ta'til
            tajribasini ta'minlaydi. Fife va Drum Inn tarixiy Uchburchak
            Paketini taklif etadi, bu esa Inn'da uch kecha, nonushtalar va
            tarixiy Williamsburg, Jamestown va Yorktown'ga kirish huquqini o'z
            ichiga oladi. Yotoqxonalarda romantikaga ham mos keladi.
            Yotoqxonaning jozibasining bir qismi - bu noyoblik; san'at, bezak va
            ovqat birlashtirilgan holda to'liq tajribani yaratadi. Masalan, Fife
            va Drum mehmon xonalarida hududning kolonial tuyg'usini saqlab
            qoladi. Maxsus xususiyatlar orasida antik mebellar, ba'zi mehmon
            xonalarida zamonaviy to'rt ustunli yotoqlar, shuningdek, mehmonlar
            uchun tarixiy hududning tiklanish davridan qolgan xalq san'ati va
            artefaktlar mavjud.
          </p>
          <div className="other-text">
            <img src={q} alt="" />
            <h2>
              O‘zini o‘zi band qilgan shaxslar, o‘z maqsadlariga erishish uchun
              turli xil faoliyatlar
            </h2>
            <p>
              Hayajoningizni qondirishga tayyor bo'lganda, kurortning suv
              sportlari markazida mavjud bo'lgan suv sportlari imkoniyatlarini
              ko'rib chiqing. Stressingizni suvda qoldirmoqchimisiz? Kurortda
              kayaklar, paddleboardlar yoki tinch pedal qayiqchalari mavjud.
            </p>
          </div>
          <h1 className="title">
            Qancha vaqt emas, balki qanday yashaganingiz asosiy narsadir.
          </h1>
          <p className="simpleText">
            Hayajoningizni qondirishga tayyor bo'lganda, kurortning suv
            sportlari markazida mavjud bo'lgan suv sportlari imkoniyatlarini
            ko'rib chiqing. Stressingizni suvda qoldirmoqchimisiz? Kurortda
            kayaklar, paddleboardlar yoki tinch pedal qayiqchalari mavjud.
            Shuningdek, siz doimiy o'zgarib turadigan dengiz osti muhitini
            tajribadan o'tkazishingiz uchun snorkel uskunalari ham mavjud.
            Yotoqxonalarga tashrif buyuruvchilar, tashrif buyurayotgan joylari
            haqida noyob nuqtai nazar olish bilan birga, boshqa mehmonxona
            sharoitlarida mavjud bo'lmagan maxsus paketlar uchun variantlarga
            ega. Yotoqxonalarning mahalliy bizneslar bilan hamkorlik qilishlari
            oson, bu esa yaxshi tashkil etilgan va shaxsiylashtirilgan ta'til
            tajribasini ta'minlaydi. Fife va Drum Inn tarixiy Uchburchak
            Paketini taklif etadi, bu esa Inn'da uch kecha, nonushtalar va
            tarixiy Williamsburg, Jamestown va Yorktown'ga kirish huquqini o'z
            ichiga oladi. Yotoqxonalarda romantikaga ham mos keladi.
            Yotoqxonaning jozibasining bir qismi - bu noyoblik; san'at, bezak va
            ovqat birlashtirilgan holda to'liq tajribani yaratadi. Masalan, Fife
            va Drum mehmon xonalarida hududning kolonial tuyg'usini saqlab
            qoladi. Maxsus xususiyatlar orasida antik mebellar, ba'zi mehmon
            xonalarida zamonaviy to'rt ustunli yotoqlar, shuningdek, mehmonlar
            uchun tarixiy hududning tiklanish davridan qolgan xalq san'ati va
            artefaktlar mavjud.
          </p>
        </div>
        <div className="forBackgroundColor">
          <div className="poster">
            <div className="left-side">
              <div className="bigText">
                <p>Ipakchilikdagi muvaffaqiyatli tajriba</p>
                <div className="name">
                  <div className="peopleName">Mubina Ismatjonova</div>
                  <div className="work">Kasanachi, ipakchi</div>
                </div>
              </div>
              <div className="smallText">
                Ipakchilikdagi muvaffaqiyatli tajriba, bu sohada amalga
                oshirilgan innovatsion yondashuvlar va zamonaviy texnologiyalar
                yordamida erishilgan natijalar haqida.
              </div>
            </div>
            <div className="right-side">
              <div className="shape"></div>
              <img src={posterImage2} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export const Route = createFileRoute('/about')({
  component: About,
})
