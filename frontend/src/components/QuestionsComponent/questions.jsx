import React, { useState, useEffect } from "react";
import "./questions.scss";
const Questions = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const questionsData = [
    {
      question: "Savol 1: Bu yerda savol matni bo'ladi",
      answer: "Savol 1 ga javob shu yerda bo'ladi.",
    },
    {
      question: "Savol 2: Bu yerda savol matni bo'ladi",
      answer: "Savol 2 ga javob shu yerda bo'ladi.",
    },
    {
      question: "Savol 3: Qo'shimcha savol matni shu yerda bo’ladi",
      answer: "Savol 3 ga javob shu yerda yozilgan.",
    },
    {
      question: "Savol 4: Qo'shimcha savol matni shu yerda bo’ladi",
      answer: "Savol 4 ga javob shu yerda yozilgan.",
    },
  ];
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".question:not(.revealed)");
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
    <div id="questions">
      <h1>Tez-tez beriladigan savollar</h1>
      <div className="questions">
        {questionsData.map((item, index) => (
          <div className="question" key={index} style={{ width: "49%" }}>
            <div className="title" onClick={() => toggleQuestion(index)}>
              {item.question}
              <span
                style={{
                  transform:
                    openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.5s ease",
                  display: "inline-block",
                  transformOrigin: "center",
                }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transformOrigin: "center",
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
            <div className={`answer ${openIndex === index ? "show" : ""}`}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
