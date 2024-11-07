import React from "react";
import "./Summary.css";
import sun from "../assets/sun.png";
import robot from "../assets/robot.png";
import exp from "../assets/exp.png";

const Summary = () => {
  return (
    <div className="summary-container">
      {/* AI 요약 날씨 카드 */}
      <div className="summary-card">
        <div className="ai-summary">
          <img src={robot} alt="AI Icon" className="summary-icon" />
          <div className="summary-content">
            <h3 className="main-card-title">AI 요약 날씨</h3>
            <p className="summary-text">
              현재 날씨는 다소 쌀쌀합니다. 10°C로 기온이 낮고, 바람도 약간 불어
              체감 온도가 더 낮게 느껴질 수 있습니다. 대체로 맑지만 실제
              사용자들의 70%는 쌀쌀하다고 느꼈어요! 추위를 잘 타는 편이시니 외출
              시 가벼운 외투를 꼭 챙기세요!
            </p>
          </div>
        </div>
      </div>

      {/* 오늘의 미션 카드 */}
      <div className="summary-card">
        <div className="mission-summary">
          <img src={sun} alt="Mission Icon" className="summary-icon" />
          <div className="summary-content">
            <h3 className="main-card-title">오늘의 미션</h3>
            <p className="mission-text">날씨가 더우니 외출 시 텀블러를 챙기세요!</p>
            <div className="mission-reward">
              <img src={exp} alt="Coin Icon" className="coin-icon" />
              <span>170</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
