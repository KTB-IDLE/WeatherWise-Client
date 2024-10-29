import React, { useState } from "react";
import "./Question.css"; // 스타일을 위한 CSS 파일

const Question = ({ imageSrc, questionText, onYes, onNo }) => {
  // 버튼 클릭 상태 관리 (null: 클릭 안 됨, 'yes': '네' 클릭, 'no': '아니요' 클릭)
  const [clickedButton, setClickedButton] = useState(null);

  const handleYesClick = () => {
    setClickedButton("yes"); // '네' 버튼 클릭 상태 설정
    onYes(); // 외부에서 전달된 onYes 함수 실행
  };

  const handleNoClick = () => {
    setClickedButton("no"); // '아니요' 버튼 클릭 상태 설정
    onNo(); // 외부에서 전달된 onNo 함수 실행
  };

  return (
    <div className="question-container">
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
