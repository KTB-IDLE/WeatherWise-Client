import React, { useState } from "react";
import "./Question.css";

const Question = ({ imageSrc, questionText, onYes, onNo, additionalClass }) => {
  const [clickedButton, setClickedButton] = useState(null);

  const handleYesClick = () => {
    setClickedButton("yes");
    onYes();
  };

  const handleNoClick = () => {
    setClickedButton("no");
    onNo();
  };

  return (
    <div className={`question-container ${additionalClass || ""}`}>
      <img src={imageSrc} alt="Question Image" className="question-image" />
      <p className="question-text">{questionText}</p>
      <div className="question-buttons">
        <button
          className={`question-button yes-button ${
            clickedButton === "yes" ? "clicked" : ""
          }`}
          onClick={handleYesClick}
        >
          네
        </button>
        <button
          className={`question-button no-button ${
            clickedButton === "no" ? "clicked" : ""
          }`}
          onClick={handleNoClick}
        >
          아니요
        </button>
      </div>
    </div>
  );
};

export default Question;
