import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessInfo.css";
import expIcon from "../assets/exp.png";

const SuccessInfo = ({ missionExp, userLevel, userExp, userLevelMaxExp }) => {
  const navigate = useNavigate();
  const currentExp = userExp;
  const totalExp = 100;
  const earnedExp = missionExp;
  const remainingExp = totalExp - currentExp;

  const handleConfirmClick = () => {
    navigate("/missions");
  };

  return (
    <div className="success-info-container">
      <div className="success-info-header">
        <img src={expIcon} alt="EXP" className="exp-icon" />
        <div className="exp-text">
          <span className="earned-exp">{earnedExp}</span>
          <span className="exp-unit"> 획득!</span>
        </div>
      </div>

      {/* 현재 레벨 표시 추가 */}
      <p className="current-level">현재 레벨: {userLevel}</p>

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

      <button className="confirm-button" onClick={handleConfirmClick}>
        확인
      </button>
    </div>
  );
};

export default SuccessInfo;
