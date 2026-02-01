import React from "react";
import "./newsInnerRight.scss";

const NewsInnerRight = ({ width }) => {
  const [newsCategories, newsList] = [[], []];

  return (
    <>
      <div
        className="right-side h-screen flex"
        style={{ width: width, minWidth: width }}
      >
        <div className="right-side-categories bg-white p-3 rounded-md"></div>
      </div>
    </>
  );
};

export default NewsInnerRight;
