import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-animation"></div>
      <p className="loading-text">잠시만 기다려 주세요...</p>
    </div>
  );
};

export default Loading;
