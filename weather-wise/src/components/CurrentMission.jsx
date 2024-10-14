import React from "react";
import "../components/CurrentMission.css";

const CurrentMission = ({
  nickName,
  currentDate,
  handlePreviousDay,
  handleNextDay,
}) => {
  // 날짜를 한국어 형식으로 표시하는 함수
  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="current-mission-container">
      <h1>{nickName ? `${nickName}님의 미션현황` : "미션현황"}</h1>
      <div className="date-navigation">
        <button onClick={handlePreviousDay} className="nav-button">
          {"<"}
        </button>
        <span className="date-display">{formatDate(currentDate)}</span>
        <button onClick={handleNextDay} className="nav-button">
          {">"}
        </button>
      </div>
    </div>
  );
};

export default CurrentMission;
