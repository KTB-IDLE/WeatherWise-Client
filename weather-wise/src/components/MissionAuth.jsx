import React, { useState } from "react";
import "./MissionAuth.css"; // 스타일을 위한 CSS 파일

const MissionAuth = ({ completed }) => {
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  // 인증하기 버튼 클릭 시 호출되는 함수
  const handleAuthClick = () => {
    if (!completed) {
      setLoading(true); // 로딩 상태로 전환

      // 10초 후에 서버로 인증 요청 (임시 처리)
      setTimeout(() => {
        setLoading(false); // 로딩 끝
        window.location.href = "http://python"; // python 서버로 리다이렉트
      }, 10000); // 10초 동안 로딩 표시
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-spinner"></div> // 로딩 중일 때 스피너 표시
      ) : (
        <button
          className={`auth-button ${completed ? "disabled" : "active"}`} // 클래스명에 따라 스타일 적용
          onClick={handleAuthClick}
          disabled={completed} // completed가 true일 때 버튼 비활성화
        >
          인증하기
        </button>
      )}
    </div>
  );
};

export default MissionAuth;
