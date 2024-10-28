import React from "react";
import Mission from "./Mission";

const MissionList = ({ missionList }) => {
  return (
    <div className="mission-list">
      {missionList.map((mission) => (
        <Mission
          key={mission.id}
          id={mission.id}
          name={mission.name}
          point={mission.point}
          completed={mission.completed}
          missionTime={mission.missionTime} // missionTime 전달
        />
      ))}
    </div>
  );
};

export default MissionList;
