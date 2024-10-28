import React, { useState } from "react";
import "./CreateMission.css";
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "./Modal";

const CreateMission = ({
  nickName,
  text,
  onMissionCreate,
  isToday,
  missionCount,
}) => {
  const [missionTimes] = useState({ 1: "아침", 2: "점심", 3: "저녁" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3) return;

    const missionTime = missionTimes[missionCount + 1];

    try {
      const response = await AxiosInstance.post("/missions", {
        nx: 25,
        ny: 25,
      });

      if (response.data.code === "success") {
        setModalMessage(`${missionTime} 미션 생성에 성공했습니다!`);
        setIsModalOpen(true);

        // 미션 생성 시 missionTime 정보를 추가해서 MissionList에 전달
        onMissionCreate({ ...response.data.result, missionTime });
      } else {
        setModalMessage(`${missionTime} 미션 생성에 실패했습니다.`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error creating mission:", error);
      setModalMessage("서버와의 통신 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
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

      {/* Modal 컴포넌트 렌더링 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
};

export default CreateMission;
