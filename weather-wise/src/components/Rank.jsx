import React from "react";
import "./Rank.css"; // Rank 스타일

const Rank = ({ rank, nickname, level }) => {
  return (
    <div className="rank-container">
      <div className="rank-item">{rank}위</div>
      <div className="rank-item">{nickname}</div>
      <div className="rank-item">{level}Lv</div>
    </div>
  );
};

export default Rank;
