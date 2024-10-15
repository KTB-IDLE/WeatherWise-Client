import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 사용
import "./MissionAuth.css"; // 스타일을 위한 CSS 파일

const MissionAuth = ({ completed, id, imageFile }) => {
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
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
          const { authenticated, missionPoint, userLevel, userPoint } =
            data.result;

          if (authenticated) {
            // 성공 시 /success 경로로 데이터 전달
            navigate("/success", {
              state: {
                missionPoint,
                userLevel,
                userPoint,
              },
            });
          } else {
            window.location.href = "/fail";
          }
        } else {
          setError("인증에 실패했습니다.");
        }
      } catch (err) {
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
            className={`auth-button ${completed ? "disabled" : "active"}`}
            onClick={handleAuthClick}
            disabled={completed}
          >
            인증하기
          </button>
        </>
      )}
    </div>
  );
};

export default MissionAuth;
