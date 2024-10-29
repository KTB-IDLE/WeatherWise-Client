import React from "react";
import "./SurveyConfirmButton.css"; // CSS 파일 임포트

const SurveyConfirmButton = ({ text, onClick }) => {
  return (
    <div className="button-container">
      <button className="confirm-button" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default SurveyConfirmButton;
