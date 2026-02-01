import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";
import facebook from "./Facebook.png";
import whatsapp from "./whatsapp.png";
import telegram from "./TelegramLogo.png";
import twitter from "./Twitter.png";
import youtube from "./Youtube.png";
import backgroundImg from "./backgroundImg.png";

const Footer = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
  return (
    <div id="footer" style={backgroundStyle}>
      <div className="details">
        <div className="detail">
          <div className="logo">
            <Link to="/">Kasana.UZ</Link>
          </div>
          <div className="tel">
            <Link to="tel:+9989999999">+998 99 999 99 99</Link>
          </div>
          <div className="mail">
            <Link to="mailto:info@kasana.uz">info@kasana.uz</Link>
          </div>
          <div className="address">Toshkent shahri, Ahmad Donish, 1A</div>
          <div className="time-work">Мы работаем с 08:00 до 20:00</div>
          <div className="aa">
            <span>© 2021 “Kasana.UZ” MCHJ</span>
            <Link to="#">Maxfiylik siyosati</Link>
          </div>
        </div>
        <div className="detail d-ver">
          <ul>
            <li>Loyiha</li>
            <li>
              <Link to="#">Kompaniya haqida</Link>
            </li>
            <li>
              <Link to="#">Yangiliklar</Link>
            </li>
            <li>
              <Link to="#">Hamkorlik</Link>
            </li>
          </ul>
        </div>
        <div className="detail d-ver">
          <ul>
            <li>Yo'nalishlar</li>
            <li>
              <Link to="#">Ish e'lonlari</Link>
            </li>
            <li>
              <Link to="#">Kasanachi topish</Link>
            </li>
            <li>
              <Link to="#">Kurslar</Link>
            </li>
            <li>
              <Link to="#">Yangiliklar</Link>
            </li>
          </ul>
        </div>
        <div className="detail d-ver">
          <ul>
            <li>Ma'lumotlar</li>
            <li>
              <Link to="#">Bizning hamkorlar</Link>
            </li>
            <li>
              <Link to="#">Tez so'raladigan savollar</Link>
            </li>
            <li>
              <Link to="#">Shaxsiy kabinet</Link>
            </li>
            <li>
              <Link to="#">Biz bilan aloqa</Link>
            </li>
          </ul>
        </div>
        <div className="detail links">
          <ul>
            <li>
              <Link to="#">
                <img src={facebook} alt="" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <img src={whatsapp} alt="" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <img src={telegram} alt="" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <img src={twitter} alt="" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <img src={youtube} alt="" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
