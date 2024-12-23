import React, { useState, useEffect } from "react";
import "./CreateMission.css"; // 동일한 CSS 파일 사용
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "./Modal";

const NewVerionCreateMission = ({
  text,
  onMissionCreate,
  isToday,
  missionCount,
}) => {
  const missionTimes = { 1: "아침", 2: "점심", 3: "저녁" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);

  const missionTimeRequirements = {
    1: 6, // 첫 번째 미션은 06:00 이후
    2: 12, // 두 번째 미션은 12:00 이후
    3: 18, // 세 번째 미션은 18:00 이후
  };

  useEffect(() => {
    if (!isToday || missionCount >= 3) {
      setTimeLeft(null);
      return;
    }

    const missionTime = missionCount + 1;
    const requiredHour = missionTimeRequirements[missionTime];
    const currentTime = new Date();
    const targetTime = new Date();
    targetTime.setHours(requiredHour, 0, 0, 0);

    if (currentTime >= targetTime) {
      setTimeLeft(0);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000)); // 남은 시간(초)
      setTimeLeft(diff);
    };

    updateCountdown(); // 초기 실행
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, [isToday, missionCount]);

  const formatTimeLeft = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}시간 ${minutes}분 ${secs}초`;
  };

  const handleCreateMission = async () => {
    if (!isToday || missionCount >= 3 || timeLeft > 0) return;

    const missionTime = missionCount + 1;

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
    <div className="created-mission-container">
      <p>{text}</p>
      <button
        className="mission-button"
        onClick={handleCreateMission}
        disabled={!isToday || missionCount >= 3 || timeLeft > 0}
      >
        {missionCount >= 3
          ? "오늘의 모든 미션 완료!"
          : timeLeft > 0
          ? `${missionTimes[missionCount + 1]} 미션 생성까지 ${formatTimeLeft(
              timeLeft
            )}`
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
