import React from "react";
import "../components/CurrentMission.css";

const CurrentMission = ({
  nickName,
  currentDate,
  handlePreviousDay,
  handleNextDay,
  isToday,
}) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="current-mission-container">
      <h1 className="state-of-mission-with-nickname">
        {nickName ? <span className="nickname-highlight">{nickName}</span> : ""}
        님의 미션현황
      </h1>
      <div className="date-navigation">
        <button onClick={handlePreviousDay} className="nav-button">
          {"<"}
        </button>
        <span className="date-display">{formatDate(currentDate)}</span>
        <button
          onClick={handleNextDay}
          className={`nav-button ${isToday ? "hidden-button" : ""}`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default CurrentMission;
