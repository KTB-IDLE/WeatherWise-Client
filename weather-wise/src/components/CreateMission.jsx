import React, { useState } from "react";
import "./CreateMission.css";
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "./Modal";

const CreateMission = ({ text, onMissionCreate, isToday, missionCount }) => {
  const missionTimes = { 1: "아침", 2: "점심", 3: "저녁" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3) return;

    const missionTime = missionCount + 1; // missionTime을 숫자로 1, 2, 3 설정

    try {
      const response = await AxiosInstance.post("/missions", {
        nx: 25,
        ny: 25,
        missionTime, // missionTime 추가
      });

      if (response.data.code === "success") {
        const newMission = {
          ...response.data.result,
          missionTime: missionTimes[missionTime], // 렌더링용으로 한글 시간 추가
        };
        setModalMessage(
          `${missionTimes[missionTime]} 미션 생성에 성공했습니다!`
        );
        setIsModalOpen(true);

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
