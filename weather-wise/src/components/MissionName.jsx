import React from "react";
import "./MissionName.css";

const MissionName = ({ missionName, missionDescription }) => {
  return (
    <div className="mission-name-container">
      <h2 className="mission-name">{missionName}</h2>
      <p className="mission-name-description">{missionDescription}</p>
    </div>
  );
};

export default MissionName;
