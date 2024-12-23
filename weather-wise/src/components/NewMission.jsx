import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewMission.css";
import exampleImage from "../assets/exp.png"; // 이미지 경로를 적절히 변경
import coinIcon from "../assets/exp.png"; // 코인 아이콘 경로를 적절히 변경

const NewMission = ({
  id,
  image,
  title,
  description,
  points,
  completed,
  missionTime,
  isToday,
}) => {
  const navigate = useNavigate();

  // 미션 시간 텍스트
  const missionTimeText = {
    MORNING: "아침",
    AFTERNOON: "점심",
    EVENING: "저녁",
  };

  // 미션 상태 텍스트
  const missionStatusText = completed
    ? "성공"
    : !isToday
    ? "종료"
    : `진행중 (${missionTimeText[missionTime] || "시간 미정"})`;

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/missions/${id}`, { state: { isToday } });
  };

  return (
    <div className="task-card" onClick={handleClick}>
      <div className="task-image">
        <img src={image || exampleImage} alt="Task Icon" />
      </div>
      <div className="task-details">
        <h3 className="task-title">{title}</h3>
        <p className="task-description">{description}</p>
      </div>
      <div className="task-points">
        <img src={coinIcon} alt="Coin Icon" className="coin-icon" />
        <span>{points}</span>
      </div>
      <div
        className={`task-status ${
          completed ? "success" : !isToday ? "ended" : "progress"
        }`}
      >
        {missionStatusText}
      </div>
    </div>
  );
};

export default NewMission;
