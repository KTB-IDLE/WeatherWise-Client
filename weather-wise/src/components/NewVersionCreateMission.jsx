import React, { useState } from "react";
import "./NewVerionCreateMission.css";
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "./Modal";

// 시간 제약이 있는 CreateMission

const NewVerionCreateMission = ({
  text,
  onMissionCreate,
  isToday,
  missionCount,
}) => {
  const missionTimes = { 1: "아침", 2: "점심", 3: "저녁" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 각 미션이 생성 가능한 시간대를 정의합니다.
  const missionTimeRequirements = {
    1: 6, // 첫 번째 미션은 06:00 이후
    2: 12, // 두 번째 미션은 12:00 이후
    3: 18, // 세 번째 미션은 18:00 이후
  };

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3) return;

    const missionTime = missionCount + 1;

    // 현재 시간 확인
    const currentHour = new Date().getHours();
    const requiredHour = missionTimeRequirements[missionTime];

    // 미션 생성 가능한 시간이 아닐 경우 모달 메시지 표시 후 return
    if (currentHour < requiredHour) {
      setModalMessage(
        `${missionTimes[missionTime]} 미션은 ${requiredHour}:00 이후에 생성 가능합니다.`
      );
      setIsModalOpen(true);
      return;
    }

    // 시간 조건을 만족하면 미션 생성 요청
    try {
      const response = await AxiosInstance.post("/missions", {
        nx: 25,
        ny: 25,
        missionTime,
      });

      if (response.data.code === "success") {
        const newMission = {
          ...response.data.result,
          missionTime: missionTimes[missionTime],
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

export default NewVerionCreateMission;
