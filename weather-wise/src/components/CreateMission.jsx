import React from "react";
import "./CreateMission.css";

const CreateMission = ({ nickName, text }) => {
  return (
    <div className="create-mission-container">
      <h1>{nickName ? `${nickName}님` : "에코왕님"}</h1>
      <p>{text}</p> {/* props로 받은 text를 표시 */}
      <button className="mission-button">미션 생성하기</button>
    </div>
  );
};

export default CreateMission;
