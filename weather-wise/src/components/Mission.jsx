import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mission.css";
import expImage from "../assets/exp.png";

const Mission = ({ id, name, point, completed, missionTime }) => {
  const navigate = useNavigate();

  // missionTime에 따른 한글 표시 텍스트
  const missionTimeText = {
    MORNING: "아침",
    AFTERNOON: "점심",
    EVENING: "저녁",
  };

  // 클릭 시 특정 id로 페이지 이동 및 API 호출을 위한 함수
  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/missions/${id}`);
  };

  return (
    <button onClick={handleClick} className="mission-container">
      <div className="mission-left">
        <p className="mission-text">{name}</p>
        <div className="mission-exp">
          <img src={expImage} alt="exp-icon" className="exp-icon" />
          <span className="exp-value">{point}</span>
        </div>
      </div>
      <div className={`mission-status ${completed ? "success" : "progress"}`}>
        {completed
          ? "성공"
          : `진행중(${missionTimeText[missionTime] || "시간 미정"})`}
      </div>
    </button>
  );
};

export default Mission;
