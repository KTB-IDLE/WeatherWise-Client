import React from "react";
import Mission from "./Mission";

const MissionList = ({ missionList }) => {
  return (
    <div className="mission-list">
      {missionList.map((mission) => (
        <Mission
          key={mission.id}
          name={mission.name}
          point={mission.point}
          completed={mission.completed}
        />
      ))}
    </div>
  );
};

export default MissionList;
