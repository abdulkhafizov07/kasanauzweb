import React, { useEffect } from "react";

import "./goodTeachers.scss";

import img1 from "./img1.png";
import img2 from "./img2.png";
import img3 from "./img3.png";
import img4 from "./img4.png";

import Loading from "../LoaderComponent/loading";

const ProTeachers = () => {
  const proTeachers = [
    {
      id: 1,
      image: img1,
      type: "Silk yo'nalishi",
      title: "Alimardon Shohnazarov",
      successMessage: "Sentabrning eng yaxshi sotuvchisi",
      income: "$25k+ umumiy daromadlar",
    },
    {
      id: 2,
      image: img2,
      type: "Sabzavotchilik",
      title: "Shomurodov Eldorjon",
      successMessage: "Sentabrning eng yaxshi sotuvchisi",
      income: "$25k+ umumiy daromadlar",
    },
    {
      id: 3,
      image: img3,
      type: "Silk yo'nalishi",
      title: "Alimardon Shohnazarov",
      successMessage: "Sentabrning eng yaxshi sotuvchisi",
      income: "$25k+ umumiy daromadlar",
    },
    {
      id: 4,
      image: img4,
      type: "Silk yo'nalishi",
      title: "Alimardon Shohnazarov",
      successMessage: "Sentabrning eng yaxshi sotuvchisi",
      income: "$25k+ umumiy daromadlar",
    },
  ];

  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(
        ".scroll-fade-effect:not(.revealed)"
      );
      reveals.forEach((revealElement) => {
        const windowHeight = window.innerHeight;
        const revealTop = revealElement.getBoundingClientRect().top;
        const revealPoint = windowHeight * 0.9;
        if (
          revealTop < revealPoint &&
          !revealElement.classList.contains("revealed")
        ) {
          revealElement.classList.add("revealed");
        }
      });
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div id="successPeople">
      <h1>Mohir ustozlar</h1>
      <div className="success-cards">
        {proTeachers.length > 0 ? (
          proTeachers.map((person) => (
            <div className="success-card scroll-fade-effect" key={person.id}>
              <img src={person.image} alt={person.title} />
              <div className="texts">
                <div className="type">{person.type}</div>
                <div className="title">{person.title}</div>
                <div className="successMessage">{person.successMessage}</div>
                <div className="income">{person.income}</div>
              </div>
            </div>
          ))
        ) : (
          <p>
            <Loading />
          </p>
        )}
      </div>
    </div>
  );
};

export default ProTeachers;
