import React, { useState } from "react";
import "./CreateMission.css";
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "./Modal";

const CreateMission = ({ text, onMissionCreate, isToday, missionCount }) => {
  // missionTimes를 영어 값으로 설정
  const missionTimes = { 1: "MORNING", 2: "AFTERNOON", 3: "EVENING" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3) return;

    const missionTime = missionCount + 1;

    try {
      const response = await AxiosInstance.post("/missions", {
        // 동적으로 위치 받는 걸로 수정 (TODO)
        nx: 25,
        ny: 25,
        missionTime: missionTimes[missionTime], // missionTime을 영어로 설정
      });

      if (response.data.code === "success") {
        const newMission = {
          ...response.data.result,
          missionTime: missionTimes[missionTime], // missionTime을 영어로 설정
        };
        setModalMessage(
          `${missionTimes[missionTime]} 미션 생성에 성공했습니다!`
        );
        setIsModalOpen(true);
        console.log();

        // MissionList에 생성된 미션 전달 및 localStorage에 저장
        onMissionCreate(newMission);
        const updatedMissionList = [
          ...(JSON.parse(localStorage.getItem("missionList")) || []),
          newMission,
        ];
        localStorage.setItem("missionList", JSON.stringify(updatedMissionList));
      } else {
        setModalMessage(
          `${missionTimes[missionTime]} 미션 생성에 실패했습니다.`
        );
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error creating mission:", error);
      setModalMessage("서버와의 통신 중 오류가 발생했습니다.");
      setIsModalOpen(true);
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default CreateMission;
