import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import "./Mission.css";
import expImage from "../assets/exp.png";

const Mission = ({ id, name, point, completed }) => {
  const navigate = useNavigate();

  // 클릭 시 특정 id로 페이지 이동 및 API 호출을 위한 함수
  const handleClick = () => {
    navigate(`/missions/${id}`); // /missions/{id} 로 이동
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
        {completed ? "성공" : "진행중"}
      </div>
    </button>
  );
};

export default Mission;
