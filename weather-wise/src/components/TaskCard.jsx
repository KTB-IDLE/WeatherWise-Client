import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import "./TaskCard.css";
import coinIcon from "../assets/exp.png"; // 코인 아이콘 경로를 적절히 변경
import dinner from "../assets/dinner.png";
import lunch from "../assets/lunch.png";
import morning from "../assets/morning.png";

const TaskCard = ({
  id,
  name,
  point,
  missionTime,
  completed,
  isToday,
  description,
}) => {
  const navigate = useNavigate();

  // 미션 상태 텍스트
  const missionStatusText = completed ? "성공" : !isToday ? "종료" : "진행중";

  // missionTime 값에 따라 이미지를 선택
  const getImageByMissionTime = (missionTime) => {
    switch (missionTime) {
      case "MORNING":
        return morning;
      case "아침":
        return morning;
      case "AFTERNOON":
        return lunch;
      case "점심":
        return lunch;
      case "EVENING":
        return dinner;
      case "저녁":
        return dinner;
      default:
        return null; // 기본 이미지 없음
    }
  };

  // 클릭 시 특정 페이지로 이동
  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/missions/${id}`, { state: { isToday } });
  };

  // missionTime이 존재하지 않을 경우 로딩 상태 표시
  if (!missionTime) {
    return (
      <div className="task-card-loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="task-card" onClick={handleClick}>
      {/* 왼쪽: 이미지 */}
      <div className="task-image">
        <img src={getImageByMissionTime(missionTime)} alt="Task Icon" />
      </div>

      {/* 중앙: 타이틀, 설명 */}
      <div className="task-details">
        <h3 className="task-title">{name}</h3>
        <p className="task-mission-time">{description}</p>
      </div>

      {/* 오른쪽: 포인트 및 상태 */}
      <div className="task-points-status">
        <div className="task-points">
          <img src={coinIcon} alt="Coin Icon" className="coin-icon" />
          <span>{point}</span>
        </div>
        <div
          className={`task-status ${
            completed ? "success" : !isToday ? "ended" : "progress"
          }`}
        >
          {missionStatusText}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
