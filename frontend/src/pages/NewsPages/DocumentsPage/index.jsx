import "./index.scss";

import { useParams, Link } from "react-router-dom";

import aaa from "./Без имени-2 1.png";

import Weather from "../../../components/WeatherComponent/weather";

const DocumentsPage = () => {
  const { type } = useParams();
  const [legislativeDoc, bussinessDoc] = [[], []];

  return (
    <div id="documentsPage">
      <div className="to-back">
        <div className="inner">
          <Link to="/">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 18.3334V10H12.5V18.3334M2.5 7.50002L10 1.66669L17.5 7.50002V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1578 16.2754 18.3334 15.8333 18.3334H4.16667C3.72464 18.3334 3.30072 18.1578 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.50002Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Link to={`/news`}>Yangiliklar</Link>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            {type === "a"
              ? "Qonunchilik hujjatlari"
              : "Kichik biznes loyihalar"}
          </span>
        </div>
      </div>
      <div className="allProductsPoster">
        <div className="inner">
          <h2>
            {type === "a"
              ? "Qonunchilik hujjatlari"
              : "Kichik biznes loyihalar"}
          </h2>
          <img src={aaa} alt="" />
        </div>
      </div>
      <div className="docs">
        <div className="left-side">
          {(type === "a" ? legislativeDoc : bussinessDoc).map((doc) => (
            <div key={doc.id} className="container">
              <p>{doc.title}</p>
              <p>{doc.subtitle}</p>
              <div className="links">
                <a href={``} download>
                  <svg
                    className="hover-effect"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 10.5V13.1667C14 13.5203 13.8595 13.8594 13.6095 14.1095C13.3594 14.3595 13.0203 14.5 12.6667 14.5H3.33333C2.97971 14.5 2.64057 14.3595 2.39052 14.1095C2.14048 13.8594 2 13.5203 2 13.1667V10.5M4.66667 7.16667L8 10.5M8 10.5L11.3333 7.16667M8 10.5V2.5"
                      stroke="#41A58D"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Yuklab olish
                </a>
                <a
                  href={
                    type === "a"
                      ? doc.link
                      : `/news/documents/details/${doc.id}/`
                  }
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.666992 8.49996C0.666992 8.49996 3.33366 3.16663 8.00033 3.16663C12.667 3.16663 15.3337 8.49996 15.3337 8.49996C15.3337 8.49996 12.667 13.8333 8.00033 13.8333C3.33366 13.8333 0.666992 8.49996 0.666992 8.49996Z"
                      stroke="#0678FA"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.00033 10.5C9.10489 10.5 10.0003 9.60453 10.0003 8.49996C10.0003 7.39539 9.10489 6.49996 8.00033 6.49996C6.89576 6.49996 6.00033 7.39539 6.00033 8.49996C6.00033 9.60453 6.89576 10.5 8.00033 10.5Z"
                      stroke="#0678FA"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {type === "a" ? "Lex.uz" : "Ko'rish"}
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* {visibleNews < legislativeDoc.length && (
          <div className="showMoreBtn">
            <button onClick={handleShowMore}>Ko'proq ko'rish</button>
          </div>
        )} */}
      </div>
      {/* <HistoryOfSuccess />
      <LittlePoster /> */}
      <br />
      <h2 className="currency-title">Foydali ma'lumotlar</h2>
      <p className="currency-little-title">Iqlim va valyuta ma'lumotlari</p>

      <div className="g-container">
        <Weather />
        {/* <CurrencyRates /> */}
      </div>
      <br />
    </div>
  );
};

export default DocumentsPage;
