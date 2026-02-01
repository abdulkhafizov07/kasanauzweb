import React from "react";
import "./contacts.scss";
import backgroundImage1 from "./backgroundImage1.jpg";
import backgroundImage2 from "./backgroundImage2.png";
import posterImage2 from "@/pages/OnlineShopPages/HomePage/posterImg2.png";

const ContactsPage = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage1})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%",
  };
  const posterStyle = {
    backgroundImage: `url(${backgroundImage2})`,
    // backgroundSize: "cover",
    // backgroundRepeat: "no-repeat",
    // backgroundPosition: "center",
    width: "100%",
    opacity: 0.02,
  };
  return (
    <section id="contacts">
      <div className="form-container" style={backgroundStyle}>
        <h1>
          Loyiha faoliyati bo'yicha savollar yoki takliflar uchun oynani
          to'ldiring.
        </h1>
        <div className="form-inner">
          <div className="form-inner-left-side">
            <div className="contact-data">
              <div className="contact-data-left">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="24" fill="white" />
                  <path
                    d="M33.9975 28.92V31.92C33.9986 32.1985 33.9416 32.4742 33.83 32.7294C33.7184 32.9845 33.5548 33.2136 33.3496 33.4019C33.1443 33.5901 32.9021 33.7335 32.6382 33.8227C32.3744 33.9119 32.0949 33.9451 31.8175 33.92C28.7403 33.5856 25.7845 32.5342 23.1875 30.85C20.7713 29.3147 18.7228 27.2662 17.1875 24.85C15.4975 22.2412 14.4457 19.271 14.1175 16.18C14.0925 15.9035 14.1254 15.6248 14.214 15.3616C14.3026 15.0985 14.4451 14.8567 14.6323 14.6516C14.8195 14.4466 15.0473 14.2827 15.3013 14.1705C15.5553 14.0583 15.8298 14.0003 16.1075 14H19.1075C19.5928 13.9952 20.0633 14.1671 20.4313 14.4835C20.7992 14.8 21.0396 15.2395 21.1075 15.72C21.2341 16.6801 21.4689 17.6227 21.8075 18.53C21.942 18.8879 21.9712 19.2769 21.8914 19.6509C21.8116 20.0249 21.6264 20.3681 21.3575 20.64L20.0875 21.91C21.511 24.4136 23.5839 26.4865 26.0875 27.91L27.3575 26.64C27.6294 26.3711 27.9726 26.1859 28.3466 26.1061C28.7206 26.0263 29.1096 26.0555 29.4675 26.19C30.3748 26.5286 31.3174 26.7634 32.2775 26.89C32.7633 26.9585 33.2069 27.2032 33.524 27.5775C33.8412 27.9518 34.0097 28.4296 33.9975 28.92Z"
                    stroke="#41A58D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="contact-data-right">
                <p>Telefon raqami</p>
                <p>
                  <a href="tel:+998998765432">+998 99 876 54 32</a>
                </p>
                <p>
                  <a href="tel:+998991234567">+998 99 123 45 67</a>
                </p>
              </div>
            </div>
            <div className="contact-data">
              <div className="contact-data-left">
                <svg
                  width="48"
                  height="56"
                  viewBox="0 0 48 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="4" width="48" height="48" rx="24" fill="white" />
                  <path
                    d="M34 22C34 20.9 33.1 20 32 20H16C14.9 20 14 20.9 14 22M34 22V34C34 35.1 33.1 36 32 36H16C14.9 36 14 35.1 14 34V22M34 22L24 29L14 22"
                    stroke="#41A58D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="contact-data-right">
                <p>Elektron pochta</p>
                <p>
                  <a href="mailto:info@kasana.uz">info@kasana.uz</a>
                </p>
                <p>
                  <a href="mailto:support@kasana.uz">support@kasana.uz</a>
                </p>
              </div>
            </div>
            <div className="contact-data">
              <div className="contact-data-left">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="24" fill="white" />
                  <path
                    d="M15 23L34 14L25 33L23 25L15 23Z"
                    stroke="#41A58D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="contact-data-right">
                <p>Manzil</p>
                <p>100066, Toshkent shahar, Islom Karimov ko'chasi, 45</p>
              </div>
            </div>
          </div>
          <div className="form-inner-right-side">
            <form action="">
              <div className="input-row">
                <input id="name" name="name" type="text" required />
                <label htmlFor="name">Ism va familiya</label>
              </div>
              <div className="input-row">
                <input id="phone" name="phone" type="tel" required />
                <label htmlFor="phone">Telefon raqami</label>
              </div>
              <div className="input-row">
                <textarea id="message" name="message" required></textarea>
                <label htmlFor="message" id="other-label">
                  Xabaringizni kiriting
                </label>
              </div>
              <div className="input-row">
                <button type="submit">
                  Yuborish{" "}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.16406 10H15.8307M15.8307 10L9.9974 4.16667M15.8307 10L9.9974 15.8333"
                      stroke="white"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="forBackgroundColor">
        <div className="qqwwee" style={posterStyle}></div>
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
              Ipakchilikdagi muvaffaqiyatli tajriba, bu sohada amalga oshirilgan
              innovatsion yondashuvlar va zamonaviy texnologiyalar yordamida
              erishilgan natijalar haqida.
            </div>
          </div>
          <div className="right-side">
            <div className="shape"></div>
            <img src={posterImage2} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
