import React from "react";
import "./CreateMission";

const MissionDetailsHedaer = ({ nickName }) => {
  return (
    <div className="create-mission-container">
      <h1>{nickName ? `${nickName}님` : "에코왕님"}</h1>
      <p>새로운 미션을 수행해보세요!</p>
    </div>
  );
};

export default MissionDetailsHedaer;
