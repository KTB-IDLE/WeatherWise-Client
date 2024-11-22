import React, { useEffect } from "react";
import "./SuccessCommentEvent.css";

const SuccessCommentEvent = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationEnd) {
        onAnimationEnd(); // 4초 뒤 부모 컴포넌트에 알림
      }
    }, 4000); // 4초 뒤에 상태 변경

    return () => clearTimeout(timer); // 타이머 정리
  }, [onAnimationEnd]);

  return (
    <div className="mission-success-container">
      {/* 축하 텍스트 */}
      <h1 className="mission-success-text">Congratulations!</h1>

      {/* 흩어지는 별 */}
      <div className="star"></div>
      <div className="star"></div>
      <div className="star"></div>
      <div className="star"></div>
      <div className="star"></div>
    </div>
  );
};

export default SuccessCommentEvent;
