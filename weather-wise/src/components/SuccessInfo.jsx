import React from "react";
import "./SuccessInfo.css"; // 스타일 파일 임포트
import expIcon from "../assets/exp.png"; // 이미지 임시 대체

// SuccessInfo에서 props를 통해 전달된 데이터를 사용
const SuccessInfo = ({ missionExp, userLevel, userExp, userLevelMaxExp }) => {
  const currentExp = userExp; // 현재 경험치
  const totalExp = userLevelMaxExp; // 레벨업에 필요한 총 경험치
  const earnedExp = missionExp; // 미션에서 획득한 경험치
  const remainingExp = totalExp - currentExp; // 남은 경험치

  return (
    <div className="success-info-container">
      <div className="success-info-header">
        <img src={expIcon} alt="EXP" className="exp-icon" />
        <div className="exp-text">
          <span className="earned-exp">{earnedExp}</span>
          <span className="exp-unit"> 획득!</span>
        </div>
      </div>
      <p className="remaining-exp">
        다음 레벨업까지 {remainingExp} EXP 남았어요!
      </p>

      <div className="exp-bar-container">
        <div className="exp-bar">
          <div
            className="exp-bar-progress"
            style={{ width: `${(currentExp / totalExp) * 100}%` }}
          />
        </div>
        <span className="exp-bar-text">
          {currentExp} / {totalExp}
        </span>
      </div>

      <button className="confirm-button">확인</button>
    </div>
  );
};

export default SuccessInfo;
