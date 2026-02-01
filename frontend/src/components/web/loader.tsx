import React from "react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex w-full h-full items-center justify-center py-12">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingComponent;
