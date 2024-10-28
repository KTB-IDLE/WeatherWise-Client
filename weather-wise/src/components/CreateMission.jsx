import React, { useState } from "react";
import "./CreateMission.css";
import AxiosInstance from "../utils/AxiosInstance";

const CreateMission = ({
  nickName,
  text,
  onMissionCreate,
  isToday,
  missionCount,
}) => {
  const [missionTimes] = useState({ 1: "아침", 2: "점심", 3: "저녁" });

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3) return;

    const missionTime = missionTimes[missionCount + 1];

    try {
      const response = await AxiosInstance.post("/missions", {
        nx: 25,
        ny: 25,
      });

      if (response.data.code === "success") {
        alert(`${missionTime} 미션 생성에 성공했습니다!`);

        // 미션 생성 시 missionTime 정보를 추가해서 MissionList에 전달
        onMissionCreate({ ...response.data.result, missionTime });
      } else {
        alert(`${missionTime} 미션 생성에 실패했습니다.`);
      }
    } catch (error) {
      console.error("Error creating mission:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="create-mission-container">
      <p>{text}</p>
      <button
        className="mission-button"
        onClick={handleCreateMission}
        disabled={!isToday || missionCount >= 3}
      >
        {missionCount >= 3
          ? "오늘의 미션 완료!"
          : !isToday
          ? "미션 생성 불가"
          : "미션 생성하기"}
      </button>
    </div>
  );
};

export default CreateMission;
