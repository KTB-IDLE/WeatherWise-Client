import React from "react";
import Mission from "./Mission";

const RankList = ({ RankList }) => {
  return (
    <div className="mission-list">
      {RankList.map((rank) => (
        <rank
          key={mission.id}
          id={mission.id} // ID를 전달
          name={mission.name} // 이름을 전달
          point={mission.point} // 경험치를 전달
          completed={mission.completed} // 완료 여부 전달
        />
      ))}
    </div>
  );
};

export default RankList;
