// Summary.jsx
import React from "react";
import "./Summary.css";
import { useNavigate } from "react-router-dom";
import sun from "../assets/chat.png";
import robot from "../assets/robott.png";
import exp from "../assets/exp.png";

const Summary = ({ aiMessage, locationData }) => {
  const navigate = useNavigate();
  console.log("Summary - locationData:", locationData);
  console.log("aiMessage : ", aiMessage);

  // 클릭 시 /chat-list 경로로 이동
  const handleMissionClick = () => {
    navigate("/chat-list", {
      state: {
        locationData, // 여기에 원하는 데이터(위도·경도)를 넣으면 됨
      },
    });
  };

  // aiMessage가 비어있을 경우 처리
  const renderAiMessage = () => {
    if (!aiMessage) {
      return <p className="summary-text">AI 메시지가 없습니다.</p>;
    }
    return aiMessage.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="summary-container">
      {/* AI 요약 날씨 카드 */}
      <div className="summary-card">
        <div className="ai-summary">
          <img src={robot} alt="AI Icon" className="summary-icon-robot" />
          <div className="summary-content">
            <h3 className="main-card-title">AI 요약 날씨</h3>
            <p className="summary-text">{renderAiMessage()}</p>
          </div>
        </div>
      </div>

      {/* 오늘의 미션 카드 */}
      <div
        className="summary-card"
        onClick={handleMissionClick}
        style={{ cursor: "pointer" }}
      >
        <div className="mission-summary">
          <img src={sun} alt="Mission Icon" className="summary-icon" />
          <div className="summary-content">
            <h3 className="main-card-title">기상특보 오픈채팅방</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
