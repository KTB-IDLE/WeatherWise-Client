import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MissionAuth.css";
import Modal from "./Modal";
import AxiosInstance from "../utils/AxiosInstance";

const MissionAuth = ({ completed, id, imageFile, resetImage }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (!completed && imageFile) {
      setLoading(true);

      const formData = new FormData();
      formData.append("imageFile", imageFile);

      try {
        const response = await AxiosInstance.post(
          `/mission-histories/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = response.data;

        if (data.code === "success") {
          const {
            authenticated,
            missionExp,
            userLevel,
            userExp,
            userLevelTotalExp,
          } = data.result;

          if (authenticated) {
            navigate("/success", {
              state: {
                missionExp,
                userLevel,
                userExp,
                userLevelMaxExp: userLevelTotalExp,
              },
            });
          } else {
            setModalMessage(
              "인증에 실패했습니다! 다른 사진으로 다시 인증해주세요."
            );
            setIsModalOpen(true);
            resetImage();
          }
        } else {
          setModalMessage("인증에 실패했습니다. 다시 시도해 주세요.");
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("API 호출 오류:", err);
        setModalMessage("서버와의 통신 중 오류가 발생했습니다.");
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    } else if (!imageFile) {
      setModalMessage("이미지를 선택해주세요.");
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <button
            className={`auth-button ${completed ? "disabled" : "active"}`}
            onClick={handleAuthClick}
            disabled={completed}
          >
            인증하기
          </button>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetImage();
        }}
        message={modalMessage}
      />
    </div>
  );
};

export default MissionAuth;
