import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 사용
import "./MissionAuth.css"; // 스타일을 위한 CSS 파일
import Modal from "./Modal"; // 모달 컴포넌트 임포트

const MissionAuth = ({ completed, id, imageFile, resetImage }) => {
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지 상태 관리
  const navigate = useNavigate(); // 경로 이동을 위한 useNavigate

  const handleAuthClick = async () => {
    if (!completed && imageFile) {
      setLoading(true); // 로딩 상태로 전환

      const formData = new FormData();
      formData.append("imageFile", imageFile); // 이미지 파일을 FormData로 추가

      try {
        const response = await fetch(
          `http://localhost:8080/api/mission-histories/${id}`,
          {
            method: "POST",
            body: formData, // FormData를 body로 전송
          }
        );

        const data = await response.json();

        if (data.code === "success") {
          const {
            authenticated,
            missionExp,
            userLevel,
            userExp,
            userLevelTotalExp,
          } = data.result;

          if (authenticated) {
            // 인증 성공 시 /success 경로로 navigate
            navigate("/success", {
              state: {
                missionExp,
                userLevel,
                userExp,
                userLevelMaxExp: userLevelTotalExp,
              },
            });
          } else {
            // 인증 실패 시 모달을 통해 경고창 표시
            setModalMessage(
              "인증에 실패했습니다! 다른 사진으로 다시 인증해주세요."
            );
            setIsModalOpen(true); // 모달 열기
            resetImage(); // 이미지 초기화
          }
        } else {
          setError("인증에 실패했습니다.");
        }
      } catch (err) {
        console.log(err);
        setError("서버와의 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    } else if (!imageFile) {
      setError("이미지를 선택해주세요."); // 이미지가 없을 때 에러 메시지
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-spinner"></div> // 로딩 중일 때 스피너 표시
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <button
            className={`auth-button ${completed ? "disabled" : "active"}`} // completed가 false면 활성화
            onClick={handleAuthClick}
            disabled={completed} // completed가 true일 때 버튼 비활성화
          >
            인증하기
          </button>
        </>
      )}

      {/* 모달 컴포넌트 사용 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        message={modalMessage} // 모달에 표시할 메시지
      />
    </div>
  );
};

export default MissionAuth;
