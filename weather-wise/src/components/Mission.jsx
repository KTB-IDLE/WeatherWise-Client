import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mission.css";
import expImage from "../assets/exp.png";

const Mission = ({ id, name, point, completed, missionTime, isToday }) => {
  const navigate = useNavigate();

  const missionTimeText = {
    MORNING: "아침",
    AFTERNOON: "점심",
    EVENING: "저녁",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/missions/${id}`, { state: { isToday } });
  };

  const missionStatusText = completed
    ? "성공"
    : !isToday
    ? "종료"
    : `진행중 (${missionTimeText[missionTime] || "시간 미정"})`;

  return (
    <button onClick={handleClick} className="mission-container">
      {/* 왼쪽: 텍스트 및 경험치 */}
      <div className="mission-left">
        <p className="mission-text">{name}</p>
        <div className="mission-exp">
          <img src={expImage} alt="exp-icon" className="exp-icon" />
          <span className="exp-value">{point}</span>
        </div>
      </div>
      {/* 오른쪽: 상태 표시 */}
      <div
        className={`mission-status ${
          completed ? "success" : !isToday ? "ended" : "progress"
        }`}
      >
        {missionStatusText}
      </div>
    </button>
  );
};

export default Mission;
