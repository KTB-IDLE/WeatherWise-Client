import React from "react";
import "./Mission.css";
import expImage from "../assets/exp.png";

const Mission = ({ name, point, completed }) => {
  return (
    <div className="mission-container">
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
    </div>
  );
};

export default Mission;
