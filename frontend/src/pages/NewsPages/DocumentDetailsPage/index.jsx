import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./index.scss";

import Loading from "../../../components/LoaderComponent/loading";


const DocumentDetailsPage = () => {
  const [currentDoc, setCurrentDoc] = useState(null);
  const { id } = useParams();

  if (!(currentDoc && currentDoc.file)) {
    return <Loading/>;
  }

  return (<div id="pdf">
      {currentDoc ? (
        <>
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
              <Link to="/news">Yangiliklar</Link>
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
              <Link to={`/news/documents/@b/`}>
              Kichik biznes loyihalar
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
              <span>{currentDoc.title}</span>
            </div>
          </div>
          {currentDoc.file ? (
              <embed src={null} type="application/pdf" />
            ) : (
              <h2 style={{margin: "20px 50px"}}>Pdf mavjud emas</h2>
            )
          }
        </>
      ) : (
        <h2 className="doc-not-found">O'ylashimcha bunday hujjat mavjud emas</h2>
      )}
    </div>);
};

export default DocumentDetailsPage;
