import React from "react";
import "../components/CurrentMission.css";
import calLeft from "../assets/cal_left.png"; // 이미지 경로
import calRight from "../assets/cal_right.png"; // 이미지 경로

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
          <img src={calLeft} alt="Previous Day" className="nav-icon" />
        </button>
        <span className="date-display">{formatDate(currentDate)}</span>
        <button
          onClick={handleNextDay}
          className={`nav-button ${isToday ? "hidden-button" : ""}`}
        >
          <img src={calRight} alt="Next Day" className="nav-icon" />
        </button>
      </div>
    </div>
  );
};

export default CurrentMission;
