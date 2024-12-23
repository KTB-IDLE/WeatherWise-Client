import React from "react";
import Mission from "./Mission";
import NewMission from "./NewMission";
import TaskCard from "./TaskCard";

const MissionList = ({ missionList, isToday }) => {
  console.log(missionList);
  return (
    <div className="mission-list">
      {missionList.map((mission) => (
        <TaskCard
          key={mission.id}
          id={mission.id}
          name={mission.name}
          point={mission.point}
          completed={mission.completed}
          description={mission.description}
          missionTime={mission.missionTime}
          isToday={isToday}
        />
      ))}
    </div>
  );
};

export default MissionList;
