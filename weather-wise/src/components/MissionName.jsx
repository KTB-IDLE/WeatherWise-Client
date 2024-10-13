import React from "react";
import "./MissionName.css"; // CSS 파일을 불러옴

const MissionName = ({ missionName }) => {
  return <h2 className="mission-name">{missionName}</h2>; // class 추가
};

export default MissionName;
