import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mission.css";
import expImage from "../assets/exp.png";

const Mission = ({ id, name, point, completed, missionTime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
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
        {completed ? "성공" : `진행중 (${missionTime})`}
      </div>
    </button>
  );
};

export default Mission;
