import React from "react";
import Mission from "./Mission";

const MissionList = ({ missionList, isToday }) => {
  return (
    <div className="mission-list">
      {missionList.map((mission) => (
        <Mission
          key={mission.id}
          id={mission.id}
          name={mission.name}
          point={mission.point}
          completed={mission.completed}
          missionTime={mission.missionTime}
          isToday={isToday}
        />
      ))}
    </div>
  );
};

export default MissionList;
