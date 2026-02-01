import React from "react";
import backgroundImg from "@/pages/OnlineShopPages/HomePage/backgroundImg.png";
import img from "@/pages/OnlineShopPages/HomePage/posterImg.png";
import posterImage2 from "@/pages/OnlineShopPages/HomePage/posterImg2.png";
import partnerImage from "./logos.png";
import "./partners.scss";
import { Link } from "react-router-dom";

const PartnersPage = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%",
  };
  return (
    <section id="partners">
      <div className="miniPoster" style={backgroundStyle}>
        <div className="text">Xalqaro hamkorlar</div>
        <img src={img} alt="" />
      </div>
      <div className="partners-text">
        Loyiha bir qator xalqaro tashkilotlar, muassasalar va fondlar bilan
        muvaffaqiyatli aloqalarga ega.
      </div>
      <div className="partners-images">
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
        <Link to="#">
          <img src={partnerImage} alt="" />
        </Link>
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

export default PartnersPage;
