import React from "react";
import "./CreateMission.css";

const CreateMission = ({ nickName }) => {
  return (
    <div className="create-mission-container">
      <h1>{nickName ? `${nickName}님` : "에코왕님"}</h1>
      <p>새로운 미션을 만들어보세요!</p>
      <button className="mission-button">미션 생성하기</button>
    </div>
  );
};

export default CreateMission;
