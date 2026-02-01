import React from 'react';
import "./History.scss";
import flag from "./flag.png";
import president from "./president.png";
const History = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${flag})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "-250px top",
        height: "400px",
      }}
      id='history'>
        <div id="bgColor"></div>
        <div className="img">
            <img src={president} alt="" />
        </div>
        <div className="text">
            <h2>Hunarmandchilikning paydo bo‘lishi – rivojlanish sari tashlangan eng muhim tarixiy qadam</h2>
            <p>Shavkat Mirziyoyev</p>
        </div>
    </div>
  );
};

export default History;
